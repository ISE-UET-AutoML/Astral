import * as React from 'react'
import { toast } from 'sonner'
import config from 'src/features/project-build/pages/build/config'
import { usePollingStore } from 'src/store/pollingStore'
import {
	createLbProject,
	getLbProjByTask,
	startExport,
	getExportStatus,
} from 'src/features/labels/api/labelProject'

const { useState, useEffect } = React

export const useLabelProjectsTable = ({ projectInfo, updateFields, navigate }) => {
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
	const pageSize = 10

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectInfo?.task_type])

	const filteredProjects = (labelProjects || [])
		.filter(
			(item) =>
				(!serviceFilter || item.service === serviceFilter) &&
				(!bucketFilter || item.bucketName === bucketFilter) &&
				(!labeledFilter ||
					(labeledFilter === 'yes' ? item.isLabeled : !item.isLabeled)) &&
				(!searchQuery ||
					(item.title || '')
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) &&
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
	}, [
		serviceFilter,
		bucketFilter,
		labeledFilter,
		searchQuery,
		sortBy,
		sortDirection,
		labelProjects,
	])

	const totalItems = filteredProjects.length
	const startIndex = (currentPage - 1) * pageSize
	const paginatedProjects = filteredProjects.slice(
		startIndex,
		startIndex + pageSize
	)

	const hasProjects = (labelProjects || []).length > 0

	const handleContinue = async () => {
		const selectedProject = filteredProjects.find(
			(p) => p.project_id === selectedRowKeys
		)

		if (!selectedProject) return

		console.log('selectedProject', selectedProject)
		setIsExporting(true)
		try {
			const startResponse = await startExport(selectedProject.label_studio_id)
			const { task_id } = startResponse.data
			console.log('Export started, task ID:', startResponse)

			const finalResult = await pollExportStatus(task_id)
			console.log('Export completed successfully:', finalResult)
			toast.success('Data prepared successfully!')

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
			toast.error('Không thể chuẩn bị dữ liệu. Vui lòng thử lại.')
		} finally {
			setIsExporting(false)
		}
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
				hideModal()
				await fetchProjects()
			}
		} catch (error) {
			console.error('Error creating label project:', error)
		} finally {
			setTableLoading(false)
		}
	}

	const handleCreateDataset = async (createdDataset, labelProjectValues) => {
		try {
			toast.success('Dataset created successfully!')
			setShowCreateDatasetModal(false)
			usePollingStore
				.getState()
				.addPending({ dataset: createdDataset, labelProjectValues })
			await fetchProjects()
		} catch (error) {
			console.error('Error handling created dataset:', error)
		}
	}

	const renderServiceTag = (service) => (
		<span
			className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border ${
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
			className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium border ${
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

	return {
		// raw data
		labelProjects,
		// filters & sort
		serviceFilter,
		setServiceFilter,
		bucketFilter,
		setBucketFilter,
		labeledFilter,
		setLabeledFilter,
		searchQuery,
		setSearchQuery,
		sortBy,
		setSortBy,
		sortDirection,
		setSortDirection,
		// selection & pagination
		selectedRowKeys,
		setSelectedRowKeys,
		currentPage,
		setCurrentPage,
		pageSize,
		filteredProjects,
		paginatedProjects,
		totalItems,
		hasProjects,
		isSelectedProjectLabeled,
		// ui state
		tableLoading,
		isModalVisible,
		isExporting,
		showCreateDatasetModal,
		setShowCreateDatasetModal,
		// actions
		handleContinue,
		showModal,
		hideModal,
		handleCreateLabelProject,
		handleCreateDataset,
		renderServiceTag,
		renderLabeledTag,
	}
}

