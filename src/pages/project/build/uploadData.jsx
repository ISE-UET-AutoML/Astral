import React, { useEffect, useState } from 'react'
import {
	createLbProject,
	getLbProjByTask,
	startExport,
	getExportStatus,
} from 'src/api/labelProject'
import { useNavigate, useOutletContext } from 'react-router-dom'
import CreateLabelProjectModal from 'src/pages/labels/CreateLabelProjectModal'
import config from './config'
import { PATHS } from 'src/constants/paths'
import { Button } from 'src/components/shared/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'src/components/shared/ui/card'
import { CustomSelect, Option } from 'src/components/shared/ui/custom-select'
import { RadioGroup, RadioGroupItem } from 'src/components/shared/ui/radio-group'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from 'src/components/shared/ui/table'
import { Alert, AlertDescription, AlertTitle } from 'src/components/shared/ui/alert'
import { Tooltip } from 'src/components/shared/ui/tooltip'
// BackgroundShapes removed
import { message } from 'antd'
import { useTheme } from 'src/theme/ThemeProvider'
import BuildPager from './BuildPager'
import create_project from 'src/assets/images/create_project.png'
import CreateDatasetModal from 'src/pages/datasets/CreateDatasetModal'
import { usePollingStore } from 'src/store/pollingStore'
import {
	CloudUploadIcon,
	ArrowRightIcon,
	InfoCircledIcon,
	MixerHorizontalIcon,
	SearchIcon,
	SortIcon,
	SortAscIcon,
	SortDescIcon,
	DataPreparingIcon,
} from 'src/assets/svgicon'

const UploadData = () => {
	const { updateFields, projectInfo } = useOutletContext()
	const { theme } = useTheme()
	const navigate = useNavigate()
	const [labelProjects, setLabelProjects] = useState([])
	const [serviceFilter, setServiceFilter] = useState('')
	const [bucketFilter, setBucketFilter] = useState('')
	const [labeledFilter, setLabeledFilter] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState('name')
	const [sortDirection, setSortDirection] = useState('asc')
	const [selectedRowKeys, setSelectedRowKeys] = useState('')
	const [tableLoading, setTableLoading] = useState(false)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isExporting, setIsExporting] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [showCreateDatasetModal, setShowCreateDatasetModal] = useState(false)
	const pageSize = 8

	const handleCreateDataset = async (createdDataset, labelProjectValues) => {
		try {
			message.success('Dataset created successfully!')
			setShowCreateDatasetModal(false)
			usePollingStore
				.getState()
				.addPending({ dataset: createdDataset, labelProjectValues })
			await fetchProjects()
		} catch (error) {
			console.error('Error handling created dataset:', error)
		}
	}

	const pollExportStatus = (taskId) => {
		return new Promise((resolve, reject) => {
			const intervalId = setInterval(async () => {
				try {
					const response = await getExportStatus(taskId)
					const { status, result, error } = response.data

					console.log(
						`[pollExportStatus] Task ${taskId} → status: ${status}`
					)

					if (status === 'SUCCESS') {
						clearInterval(intervalId)
						console.log(
							`[pollExportStatus] Task ${taskId} completed. Result:`,
							result
						)
						resolve(result)
					} else if (status === 'FAILURE') {
						clearInterval(intervalId)
						console.error(
							`[pollExportStatus] Task ${taskId} failed. Error:`,
							error
						)
						reject(new Error(error || 'Export task failed.'))
					}
					// Nếu là PENDING thì tiếp tục chờ
				} catch (err) {
					clearInterval(intervalId)
					console.error(
						`[pollExportStatus] Error checking task ${taskId}:`,
						err?.message || err
					)
					reject(err)
				}
			}, 5000) // Hỏi lại mỗi 5 giây
		})
	}

	const fetchProjects = async () => {
		setTableLoading(true)
		try {
			console.log('Fetching label projects for task type:', projectInfo)
			const response = await getLbProjByTask(projectInfo.task_type)
			setLabelProjects(
				Array.isArray(response.data)
					? response.data.map((item) => ({
							...item,
							project_id: item.id,
							title: item.name,
							bucketName: item.bucket_name,
							isLabeled: item.annotated_nums > 0,
							service: item.service,
						}))
					: []
			)
			console.log(response)
		} catch (error) {
			console.error('Error fetching label projects by task type:', error)
		} finally {
			setTableLoading(false)
		}
	}

	useEffect(() => {
		if (!projectInfo?.task_type) return
		fetchProjects()
	}, [projectInfo?.task_type])

	const filteredProjects = (labelProjects || [])
		.filter(
			(item) =>
				(!serviceFilter || item.service === serviceFilter) &&
				(!bucketFilter || item.bucketName === bucketFilter) &&
				(!labeledFilter || (labeledFilter === 'yes' ? item.isLabeled : !item.isLabeled)) &&
				(!searchQuery || (item.title || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
				item.task_type === projectInfo?.task_type
		)
		.sort((a, b) => {
			let comparison = 0
			if (sortBy === 'name') {
				comparison = (a.title || '').localeCompare(b.title || '')
			} else if (sortBy === 'date') {
				const dateA = new Date(a.created_at || a.updated_at || 0)
				const dateB = new Date(b.created_at || b.updated_at || 0)
				comparison = dateA - dateB
			}
			return sortDirection === 'asc' ? comparison : -comparison
		})

	useEffect(() => {
		setCurrentPage(1)
	}, [serviceFilter, bucketFilter, labeledFilter, searchQuery, sortBy, sortDirection, labelProjects])

	const totalItems = filteredProjects.length
	const startIndex = (currentPage - 1) * pageSize
	const paginatedProjects = filteredProjects.slice(startIndex, startIndex + pageSize)

	const hasProjects = (labelProjects || []).length > 0

	const handleContinue = async () => {
		const selectedProject = filteredProjects.find(
			(p) => p.project_id === selectedRowKeys
		)

		if (!selectedProject) return

		console.log('selectedProject', selectedProject)
		setIsExporting(true)
		try {
			const startResponse = await startExport(
				selectedProject.label_studio_id
			)
			const { task_id } = startResponse.data
			console.log('Export started, task ID:', startResponse)

			const finalResult = await pollExportStatus(task_id)
			console.log('Export completed successfully:', finalResult)
			message.success('Data prepared successfully!')

			//await uploadToS3(selectedProject.label_studio_id)
			updateFields({
				selectedProject,
			})
			const object = config[projectInfo.task_type]
			if (!object) {
				console.error(
					'Config not found for task type:',
					projectInfo.task_type
				)
				return
			}
			navigate(
				`/app/project/${projectInfo.id}/build/${object.afterUploadURL}`
			)
		} catch (error) {
			console.error('Error exporting labels to S3:', error)
			message.error('Không thể chuẩn bị dữ liệu. Vui lòng thử lại.')
		} finally {
			setIsExporting(false) // Luôn ẩn dialog sau khi hoàn tất
		}
		//if (!selectedProject.isLabeled) {
		//  navigate(PATHS.LABEL_VIEW(selectedProject.project_id, 'labeling'))
		//}
	}

	const showModal = () => {
		setIsModalVisible(true)
	}

	const hideModal = () => {
		setIsModalVisible(false)
	}

	const handleCreateLabelProject = async (payload) => {
		setTableLoading(true)
		try {
			const response = await createLbProject(payload)
			if (response.status === 201) {
				hideModal() // Đóng modal
				await fetchProjects() // Refresh bảng
			}
		} catch (error) {
			console.error('Error creating label project:', error)
		} finally {
			setTableLoading(false)
		}
	}

	const renderServiceTag = (service) => (
		<span
			className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${
				service === 'AWS_S3'
					? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
					: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
			}`}
		>
			{service === 'AWS_S3' ? 'AWS' : 'Google Cloud'}
		</span>
	)

	const renderLabeledTag = (isLabeled) => (
		<span
			className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${
				isLabeled
					? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
					: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
			}`}
		>
			{isLabeled ? 'Yes' : 'No (Disabled)'}
		</span>
	)

	const selectedProject = selectedRowKeys
		? filteredProjects.find((p) => p.project_id === selectedRowKeys)
		: null
	const isSelectedProjectLabeled = selectedProject?.isLabeled

	return (
		<>
			<style>{`
				body, html {
					background-color: var(--surface) !important;
				}
			`}</style>
			<div className="min-h-screen bg-[var(--surface)]">
				<div className="relative pt-20 px-6 pb-20">
					<div className="relative z-10">
						{/* Header Section */}
						<div className="mb-12 flex justify-center">
							<div className="w-full max-w-4xl text-center">
								<h1 className="mb-6 text-5xl font-bold md:text-6xl text-[var(--title-project)]">
									Choose Your Label Project
								</h1>
								<p className="mx-auto max-w-2xl text-xl text-[var(--secondary-text)]">
									Select an existing label project or create a
									new one <br /> for your labeling task
								</p>
							</div>
						</div>

						{/* Main Content */}
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
							{/* Filter Sidebar */}
							<div className="lg:col-span-1">
								<Card
									className="rounded-2xl shadow-2xl sticky top-4 border [border-color:var(--border)] [background:var(--card-gradient)]"
								>
									<CardHeader>
										<CardTitle
											className="flex items-center gap-3 text-lg text-[var(--text)]"
										>
											<MixerHorizontalIcon
												className="h-5 w-5 text-[var(--accent-text)]"
											/>
											Filter Options
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-6">
										{/* Search Input */}
										<div>
											<label
												className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]"
											>
												Search by Name
												<Tooltip title="Search for projects by name">
													<InfoCircledIcon
														className="h-4 w-4 cursor-help text-[var(--secondary-text)]"
													/>
												</Tooltip>
											</label>
											<div className="relative">
												<SearchIcon
													className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--secondary-text)]"
												/>
												<input
													type="text"
													placeholder="Search projects..."
													value={searchQuery}
													onChange={(e) =>
														setSearchQuery(
															e.target.value
														)
													}
													className="w-full pl-10 pr-4 py-2 !rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--input-bg)] border-[var(--border)] text-[var(--text)]"
												/>
											</div>
										</div>

										{/* Sort Options */}
										<div>
											<label
												className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]"
											>
												Sort by
												<Tooltip title="Choose how to sort the projects">
													<InfoCircledIcon
														className="h-4 w-4 cursor-help text-[var(--secondary-text)]"
													/>
												</Tooltip>
											</label>
											<div className="flex items-center gap-2 w-full">
												<div className="flex-1">
													<CustomSelect
														value={sortBy}
														onChange={setSortBy}
														placeholder="Sort by"
														className="theme-dropdown w-full"
													>
														<Option value="name">
															Name
														</Option>
														<Option value="date">
															Date Added
														</Option>
													</CustomSelect>
												</div>

												<Tooltip
													title={`Sort ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}
												>
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															setSortDirection(
																sortDirection ===
																	'asc'
																	? 'desc'
																	: 'asc'
															)
														}
														className="p-2 h-8 w-8 flex-shrink-0 border bg-[var(--input-bg)] border-[var(--border)] text-[var(--text)]"
													>
														{sortDirection ===
														'asc' ? (
															<SortAscIcon className="h-4 w-4" />
														) : (
															<SortDescIcon className="h-4 w-4" />
														)}
													</Button>
												</Tooltip>
											</div>
										</div>

										{/* Cloud Service Filter */}
										<div>
											<label
												className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]"
											>
												Cloud Service
												<Tooltip title="Choose the cloud storage service where your label project is stored">
													<InfoCircledIcon
														className="h-4 w-4 cursor-help text-[var(--secondary-text)]"
													/>
												</Tooltip>
											</label>
											<CustomSelect
												value={serviceFilter}
												onChange={setServiceFilter}
												placeholder="Select Service"
												className="theme-dropdown"
											>
												<Option value="">
													All Services
												</Option>
												<Option value="AWS_S3">
													Amazon S3
												</Option>
												<Option value="GCP_STORAGE">
													Google Cloud Storage
												</Option>
											</CustomSelect>
										</div>

										{/* Storage Bucket Filter */}
										<div>
											<label
												className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]"
											>
												Storage Bucket
												<Tooltip title="Select the specific storage bucket containing your label project">
													<InfoCircledIcon
														className="h-4 w-4 cursor-help text-[var(--secondary-text)]"
													/>
												</Tooltip>
											</label>
											<CustomSelect
												value={bucketFilter}
												onChange={setBucketFilter}
												placeholder="Select Bucket"
												className="theme-dropdown"
											>
												<Option value="">
													All Buckets
												</Option>
												<Option value="user-private-project">
													User Private Project
												</Option>
												<Option value="bucket-1">
													Bucket 1
												</Option>
											</CustomSelect>
										</div>

										{/* Project Status Filter */}
										<div>
											<label
												className="flex items-center gap-2 font-medium mb-3 text-[var(--text)]"
											>
												Project Status
												<Tooltip title="Filter projects based on whether they're already labeled">
													<InfoCircledIcon
														className="h-4 w-4 cursor-help text-[var(--secondary-text)]"
													/>
												</Tooltip>
											</label>
											<RadioGroup
												value={labeledFilter}
												onValueChange={setLabeledFilter}
												className="space-y-3"
											>
												<div
													className="flex items-center space-x-3 cursor-pointer"
													onClick={() =>
														setLabeledFilter('')
													}
												>
													<RadioGroupItem
														value=""
														id="all"
													/>
													<label
														htmlFor="all"
														className="cursor-pointer text-[var(--secondary-text)]"
													>
														All Projects
													</label>
												</div>
												<div
													className="flex items-center space-x-3 cursor-pointer"
													onClick={() =>
														setLabeledFilter('yes')
													}
												>
													<RadioGroupItem
														value="yes"
														id="labeled"
													/>
													<label
														htmlFor="labeled"
														className="cursor-pointer text-[var(--secondary-text)]"
													>
														Labeled Projects
													</label>
												</div>
												<div
													className="flex items-center space-x-3 cursor-pointer"
													onClick={() =>
														setLabeledFilter('no')
													}
												>
													<RadioGroupItem
														value="no"
														id="unlabeled"
													/>
													<label
														htmlFor="unlabeled"
														className="cursor-pointer text-[var(--secondary-text)]"
													>
														Unlabeled Projects
													</label>
												</div>
											</RadioGroup>
										</div>

										{/* Continue Button */}
										{selectedRowKeys && (
											<Button
												onClick={handleContinue}
												className="w-full font-semibold py-3 rounded-xl transition-all duration-200 text-white border [border-color:var(--border)] [background:var(--button-gradient)]"
											>
												<span className="flex items-center justify-center gap-2">
													Go to Training
													<ArrowRightIcon className="h-4 w-4" />
												</span>
											</Button>
										)}
									</CardContent>
								</Card>
							</div>

							{/* Main Content Area */}
							<div className="lg:col-span-3 space-y-6">
								{/* Projects Table */}
								<Card
									className="rounded-2xl shadow-2xl border [border-color:var(--border)] [background:var(--card-gradient)]"
								>
									<CardContent className="p-8">
										<Alert
											className="mb-8 border text-[var(--text)] [border-color:var(--alert-info-border)] [background:var(--alert-info-bg)]"
										>
											<InfoCircledIcon
												className="h-4 w-4 text-[var(--accent-text)]"
											/>
											<AlertTitle
												className="font-medium text-[var(--text)]"
											>
												Need help choosing a label
												project?
											</AlertTitle>
											<AlertDescription
												className="mt-1 text-[var(--secondary-text)]"
											>
												If you're unsure about which
												project to select, look for one
												that matches your task type and
												is already labeled (marked with
												'Yes'). This will help you get
												started faster.
											</AlertDescription>
										</Alert>

										{tableLoading ? (
											<div className="flex items-center justify-center py-16">
												<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
												<span className="ml-4 text-gray-300 text-lg">
													Processing label project
													creation...
												</span>
											</div>
										) : hasProjects ? (
												<div className="overflow-x-auto">
													<Table>
														<TableHeader>
															<TableRow>
																<TableHead
																	className="font-semibold text-left py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]"
																>
																	Title
																</TableHead>
																<TableHead
																	className="font-semibold text-center py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]"
																>
																	Service
																</TableHead>
																<TableHead
																	className="font-semibold text-center py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]"
																>
																	Bucket
																</TableHead>
																<TableHead
																	className="font-semibold text-center py-4 border-b [background:var(--table-header-bg)] text-[var(--table-header-color)] [border-color:var(--table-header-border)]"
																>
																	Labeled
																</TableHead>
															</TableRow>
														</TableHeader>
														<TableBody>
															{filteredProjects.length ===
															0 ? (
																<TableRow>
																	<TableCell
																		colSpan={4}
																		className="text-center py-16"
																	>
																		<div className="text-[var(--secondary-text)]">
																			<CloudUploadIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
																			<p className="text-lg">
																				No label projects match your current filters
																			</p>
																		</div>
																	</TableCell>
																</TableRow>
															) : (
																paginatedProjects.map(
																	(project) => (
																		<TableRow
																			key={
																				project.project_id
																			}
																			className={`transition-all duration-200 ${
																				project.isLabeled
																					? 'cursor-pointer'
																					: 'opacity-50 cursor-not-allowed'
																			} ${
																				selectedRowKeys ===
																				project.project_id
																					? '[background:var(--selection-bg)]'
																					: ''
																			}`}
																			onClick={() => {
																				if (
																					project.isLabeled
																				) {
																					setSelectedRowKeys(
																						project.project_id
																					)
																				}
																			}}
																		>
																			<TableCell
																				className="font-medium py-4 text-[var(--text)]"
																			>
																				{
																					project.title
																				}
																			</TableCell>
																			<TableCell className="text-center py-4">
																				{renderServiceTag(
																					project.service
																				)}
																			</TableCell>
																			<TableCell
																				className="text-center py-4 text-[var(--secondary-text)]"
																			>
																				{
																					project.bucketName
																				}
																			</TableCell>
																			<TableCell className="text-center py-4">
																				{project.isLabeled ? (
																					renderLabeledTag(
																						project.isLabeled
																					)
																				) : (
																					<Tooltip title="This project has no labeled data and cannot be selected">
																						{renderLabeledTag(
																							project.isLabeled
																						)}
																					</Tooltip>
																				)}
																			</TableCell>
																		</TableRow>
																	)
																)
															)}
														</TableBody>
													</Table>
												</div>
											) : (
												<div
													className="flex flex-col items-center justify-center py-12"
												>
													<img
														src={create_project}
														alt="Create project"
														className="w-[300px] max-w-[90%] cursor-pointer drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
														onClick={() => setShowCreateDatasetModal(true)}
													/>
													<div className="mt-6 text-center">
														<div className="font-poppins text-[var(--text)] text-[24px] font-semibold">
															No Label Projects Yet
														</div>
														<div className="font-poppins text-[var(--secondary-text)] mt-[6px]">
															Start by creating your Label Projects
														</div>
													</div>
												</div>
											)}
									</CardContent>
								</Card>
								<div className="mt-6">
									<BuildPager
										currentPage={currentPage}
										totalItems={totalItems}
										pageSize={pageSize}
										onPageChange={setCurrentPage}
									/>
								</div>
							</div>
						</div>

						{/* Modals */}
						<CreateLabelProjectModal
							visible={isModalVisible}
							onCancel={hideModal}
							onCreate={handleCreateLabelProject}
						/>
					</div>
				</div>
				{isExporting && (
					<div className="absolute inset-0 z-50 flex items-center justify-center p-4">
						{/* Backdrop */}
						<div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

						{/* Modal */}
						<div className="relative z-10 w-full max-w-md">
							<div
								className="rounded-2xl shadow-2xl overflow-hidden border [background:var(--modal-bg)] [border-color:var(--modal-border)]"
							>
								{/* Header */}
								<div
									className="px-8 py-6 border-b [background:var(--modal-header-bg)] [border-color:var(--modal-header-border)]"
								>
									<div className="flex items-center justify-center">
										<div className="relative">
											{/* Animated gradient ring */}
											<div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin">
												<div
													className="w-14 h-14 rounded-full m-1 flex items-center justify-center [background:var(--modal-bg)]"
												>
													<DataPreparingIcon className="w-6 h-6 animate-pulse text-[var(--accent-text)]" />
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Content */}
								<div className="px-8 py-6 text-center">
									<h3
										className="text-xl font-semibold mb-3 text-[var(--modal-title-color)]"
									>
										Preparing Your Data
									</h3>
									<p
										className="leading-relaxed text-[var(--text)]"
									>
										The system is exporting labels and
										preparing your data for training.
										<br />
										<span
											className="text-sm mt-2 block text-[var(--secondary-text)]"
										>
											This process may take a few minutes.
											Please do not close this window.
										</span>
									</p>

									{/* Progress indicator */}
									<div className="mt-6">
										<div className="flex justify-center space-x-1">
											<div
												className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0ms]"
											></div>
											<div
												className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:150ms]"
											></div>
											<div
												className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:300ms]"
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
				<CreateDatasetModal
					visible={showCreateDatasetModal}
					onCancel={() => setShowCreateDatasetModal(false)}
					onCreate={handleCreateDataset}
				/>
			</div>
		</>
	)
}

export default UploadData
