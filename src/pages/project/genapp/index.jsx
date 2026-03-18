import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllDeployedModel, genApp, getDeployData } from 'src/api/deploy'
import { initDraft } from 'src/api/workspace'
import { getProjectById } from 'src/api/project'
import { getLatestModelVersionByModelId } from 'src/api/model_version'
import { useGenApps } from 'src/hooks/useGenApps'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'src/components/shared/ui/card'
import { Button } from 'src/components/shared/ui/button'
import { CustomSelect, Option } from 'src/components/shared/ui/custom-select'
import Modal from 'src/components/shared/utilities/Modal'
import { message } from 'antd'
import { PATHS } from 'src/constants/paths'
import AppCard from 'src/components/features/genapp/AppCard'

const AppIcon = ({ className, ...props }) => (
	<svg
		className={className}
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

const EmptyIcon = ({ className, ...props }) => (
	<svg
		className={className}
		width="48"
		height="48"
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
)

export default function ProjectGenApp() {
	const { id: projectId } = useParams()
	const navigate = useNavigate()
	const { apps, loading, error, total, page, setPage, refetch } = useGenApps(projectId, 1, 8)
	const [projectInfo, setProjectInfo] = useState(null)
	const [deploys, setDeploys] = useState([])
	const [selectedDeployId, setSelectedDeployId] = useState(null)
	const selectedModelId = deploys.find((d) => d.id === selectedDeployId)?.model_id ?? null
	const [genLoading, setGenLoading] = useState(false)
	const [appName, setAppName] = useState(null)
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [modelMetadata, setModelMetadata] = useState(null)
	const [selectedDeploy, setSelectedDeploy] = useState(null)


	const fetchDeploys = useCallback(async () => {
		try {
			const { data } = await getAllDeployedModel(projectId)
			const onlineDeploys = (data || []).filter(
				(d) => d.status === 'ONLINE'
			)
			const sorted = onlineDeploys.sort(
				(a, b) => (b.id ?? 0) - (a.id ?? 0)
			)
			setDeploys(sorted)

			if (sorted.length > 0 && !selectedDeployId) {
				setSelectedDeployId(sorted[0].id)
			}
		} catch (e) {
			message.error('Failed to fetch deploy list')
		}
	}, [projectId, selectedDeployId])

	useEffect(() => {
		fetchDeploys()
	}, [fetchDeploys])

	useEffect(() => {
		const fetchProject = async () => {
			if (!projectId) return
			try {
				const { data } = await getProjectById(projectId)
				setProjectInfo(data.project)
			} catch (e) {
				console.error('Failed to fetch project info', e)
			}
		}
		fetchProject()
	}, [projectId])

	// Fetch model metadata when selectedDeployId changes
	useEffect(() => {
		const fetchMetadata = async () => {
			if (!selectedDeployId) {
				setModelMetadata(null)
				setSelectedDeploy(null)
				return
			}

			const deploy = deploys.find((d) => d.id === selectedDeployId)
			if (!deploy) return

			try {
				setSelectedDeploy(deploy)

				const modelRes =
					await getLatestModelVersionByModelId(deploy.model_id)
				setModelMetadata(modelRes.data)

				const deployRes = await getDeployData(deploy.id)
				setSelectedDeploy(deployRes.data)
			} catch (e) {
				console.error('Failed to fetch model metadata', e)
			}
		}
		fetchMetadata()
	}, [selectedDeployId, deploys])

	// Log metadata when model changes
	useEffect(() => {
		if (
			selectedModelId &&
			(modelMetadata || selectedDeploy || projectInfo)
		) {
			console.log('Metadata to be passed to API:', {
				projectName: projectInfo?.name,
				projectDescription: projectInfo?.description,
				taskType: projectInfo?.task_type,
				labelsName: modelMetadata?.metadata?.label_column,
				labelValues: modelMetadata?.metadata?.labels,
				apiUrl: selectedDeploy?.api_base_url,
				sampleData: modelMetadata?.metadata?.sample_data,
				modelInfo: modelMetadata,
			})
		}
	}, [selectedModelId, modelMetadata, selectedDeploy, projectInfo])

	const resolveTaskType = () => {
		const raw = projectInfo?.task_type
		if (!raw) return 'image_classification'
		const upper = String(raw).toUpperCase()

		if (upper.includes('OBJECT') || upper.includes('DETECT')) {
			return 'object_detection'
		}
		if (upper.includes('TEXT')) {
			return 'text_classification'
		}
		// Mặc định: image classification
		return 'image_classification'
	}

	const buildMetadata = () => ({
		projectName: projectInfo?.name,
		projectDescription: projectInfo?.description,
		taskType: projectInfo?.task_type,
		description:
			projectInfo?.description || `A model for ${projectInfo?.task_type}`,
		labelsName: modelMetadata?.metadata?.label_column,
		labelValues: modelMetadata?.metadata?.labels,
		apiUrl: selectedDeploy?.api_base_url,
		sampleData: modelMetadata?.metadata?.sample_data,
		modelInfo: modelMetadata,
	})

	const handleConfirmGenApp = async () => {
		if (!selectedModelId) {
			message.error('Please select a model')
			return
		}

		setGenLoading(true)
		try {
			await genApp({
				modelId: selectedModelId,
				projectId,
				name: appName?.trim() || null,
				taskType: resolveTaskType(),
				metadata: buildMetadata(),
			})
			message.success('Gen app successfully')
			refetch()
			setIsFormOpen(false)
			setAppName(null)
		} catch (e) {
			message.error('Gen app failed')
		} finally {
			setGenLoading(false)
		}
	}

	const handleRetry = async (app) => {
		if (!app?.model_id) {
			message.error('Cannot retry: missing model info')
			return
		}
		const deploy = deploys.find((d) => d.model_id === app.model_id)
		if (!deploy) {
			message.error('Cannot retry: missing deploy info')
			return
		}
		setGenLoading(true)
		try {
			const [modelRes, deployRes] = await Promise.all([
				getLatestModelVersionByModelId(app.model_id),
				getDeployData(deploy.id),
			])
			const metadata = {
				projectName: projectInfo?.name,
				projectDescription: projectInfo?.description,
				taskType: app.task_type || projectInfo?.task_type,
				description: projectInfo?.description || `A model for ${app.task_type}`,
				labelsName: modelRes.data?.metadata?.label_column,
				labelValues: modelRes.data?.metadata?.labels,
				apiUrl: deployRes.data?.api_base_url,
				sampleData: modelRes.data?.metadata?.sample_data,
				modelInfo: modelRes.data,
			}
			await genApp({
				modelId: app.model_id,
				projectId,
				name: app.name || `App #${app.id}`,
				taskType: app.task_type || resolveTaskType(),
				metadata,
			})
			message.success('Retry gen app thành công')
			refetch()
		} catch (e) {
			message.error('Retry gen app thất bại')
		} finally {
			setGenLoading(false)
		}
	}



	return (
		<div className="h-full overflow-y-auto bg-gray-50 dark:bg-[var(--surface)]">
			<div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
				{/* Header */}
				<div className="mb-8 max-w-full mx-auto">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-xl bg-gray-200 dark:bg-[#2a2a2c]">
							<AppIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-[var(--text)]">
								My Apps
							</h1>
							<p className="mt-1 text-gray-500 dark:text-[var(--secondary-text)]">
								{loading ? '...' : `${total} app generated`}
							</p>
						</div>
					</div>
				</div>

				<div className="max-w-full mx-auto">
					{/* Gen App Card - chỉ hiện khi có model deploy */}
					{deploys.length > 0 && (
					<Card
						className="rounded-2xl shadow-2xl mb-6"
						style={{
							background: 'var(--card-gradient)',
							border: '1px solid var(--border)',
						}}
					>
						<CardContent className="pt-6 pb-6">
							<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
								<div className="flex-1 min-w-0">
									<h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-1">
										<span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
										Gen App
									</h3>
									<p className="text-gray-500 dark:text-gray-400 text-sm">
										Select a model and click Gen App to create an app from the model.
									</p>
								</div>
								<div className="flex flex-row items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
										Model
									</label>
									<CustomSelect
										value={selectedDeployId}
										onChange={(val) => {
											const deployId = val ?? null
											setSelectedDeployId(deployId)
										}}
										placeholder="Select a model..."
										className="theme-dropdown h-10 min-w-[200px] sm:min-w-[220px]"
									>
										{deploys.map((d) => (
											<Option key={d.id} value={d.id}>
												{d.name ?? `Model #${d.model_id}`} (Model: {d.model_id}, Deploy id: {d.id})
											</Option>
										))}
									</CustomSelect>
										<button
											onClick={() => {
												setAppName(null)
												setIsFormOpen(true)
											}}
											disabled={!selectedModelId}
											className="h-10 px-6 shrink-0 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 rounded-2xl"
										>
											Gen App
										</button>
								</div>
							</div>
						</CardContent>
					</Card>
					)}

					{/* List app đã gen */}
					{error && (
						<Card className="rounded-2xl shadow-2xl mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
							<CardContent className="py-4 text-red-600 dark:text-red-400">
								Error loading app list:{' '}
								{error?.message ?? 'Unknown'}
							</CardContent>
						</Card>
					)}
					{loading ? (
						<Card
							className="rounded-2xl shadow-2xl"
							style={{
								background: 'var(--card-gradient)',
								border: '1px solid var(--border)',
							}}
						>
							<CardContent className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
								Loading...
							</CardContent>
						</Card>
					) : apps.length > 0 ? (
						<>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{apps.map((app, i) => (
									<AppCard
										key={app.id ?? i}
										app={app}
										onViewDetails={async (app) => {
											try {
												await initDraft(app.id)
											} catch (e) {
												console.warn('[GenApp] initDraft before nav:', e)
											}
											navigate(
												`/app/project/${projectId}/my-apps/${app.id}/edit`
											)
										}}
										onRetry={handleRetry}
										isRetrying={genLoading}
									/>
								))}
							</div>

							{/* Pagination UI - Arrow & Oval Style */}
							{total > 0 && (
								<div className="mt-8 pb-10 flex items-center justify-center gap-3">
									{/* First Page */}
									<Button
										variant="outline"
										onClick={() => setPage(1)}
										disabled={page === 1 || loading}
										className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
									>
										<span className="text-xs font-bold">«</span>
									</Button>

									{/* Previous Page */}
									<Button
										variant="outline"
										onClick={() => setPage(p => Math.max(1, p - 1))}
										disabled={page === 1 || loading}
										className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
									>
										<span className="text-xs font-bold">‹</span>
									</Button>

									{/* Page Indicator - Oval Style */}
									<div className="flex items-center justify-center h-10 px-6 rounded-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white font-bold text-sm shadow-sm border border-gray-400/30 dark:border-white/10 min-w-[70px]">
										{page} / {Math.max(1, Math.ceil(total / 8))}
									</div>

									{/* Next Page */}
									<Button
										variant="outline"
										onClick={() => setPage(p => Math.min(Math.ceil(total / 8), p + 1))}
										disabled={page === Math.ceil(total / 8) || loading}
										className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
									>
										<span className="text-xs font-bold">›</span>
									</Button>

									{/* Last Page */}
									<Button
										variant="outline"
										onClick={() => setPage(Math.ceil(total / 8))}
										disabled={page === Math.ceil(total / 8) || loading}
										className="w-10 h-10 p-0 rounded-full border-gray-300 dark:border-white/10 bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
									>
										<span className="text-xs font-bold">»</span>
									</Button>
								</div>
							)}
						</>
					) : (
						<Card
							className="rounded-2xl shadow-2xl"
							style={{
								background: 'var(--card-gradient)',
								border: '1px solid var(--border)',
							}}
						>
							<CardContent className="flex flex-col items-center justify-center py-16">
								<div className="p-4 rounded-full mb-4 bg-gray-100 dark:bg-[#2a2a2c]">
									<EmptyIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
								</div>
								{deploys.length === 0 ? (
									<>
										<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-[var(--text)]">
											No model found. Please deploy a model first.
										</h3>
										<Button
											onClick={() => navigate(PATHS.PROJECT_DEPLOY(projectId))}
											className="mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl"
										>
											Go to Deploy page
										</Button>
									</>
								) : (
									<>
										<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-[var(--text)]">
											You haven't generated any apps yet
										</h3>
										<p className="text-center max-w-md text-gray-500 dark:text-[var(--secondary-text)]">
											Select a model and click Gen App to create your first app.
										</p>
									</>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Modal form để điền thông tin app */}
			<Modal
				open={isFormOpen}
				onClose={() => {
					setIsFormOpen(false)
					setAppName(null)
				}}
				title="Gen App Configuration"
			>
				<div className="space-y-4">
					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: 'var(--form-label-color)' }}
						>
							Model
						</label>
						<CustomSelect
							value={selectedDeployId}
							onChange={(val) => {
								const deployId = val ?? null
								setSelectedDeployId(deployId)
							}}
							placeholder="Select a model..."
							className="theme-dropdown w-full"
						>
							{deploys.map((d) => (
								<Option key={d.id} value={d.id}>
									{d.name ?? `Model #${d.model_id}`} (Model: {d.model_id}, Deploy id: {d.id})
								</Option>
							))}
						</CustomSelect>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: 'var(--form-label-color)' }}
						>
							App name
						</label>
						<input
							type="text"
							value={appName ?? ''}
							onChange={(e) => setAppName(e.target.value)}
							placeholder="Please enter the app name"
							className="modal-form-input w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
							style={{
								backgroundColor: 'var(--input-bg)',
								borderColor: 'var(--input-border)',
								color: 'var(--input-color)',
							}}
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium mb-1"
							style={{ color: 'var(--form-label-color)' }}
						>
							Task type
						</label>
						<input
							type="text"
							value={
								resolveTaskType() === 'object_detection'
									? 'Object Detection'
									: resolveTaskType() === 'text_classification'
										? 'Text Classification'
										: 'Image Classification'
							}
							readOnly
							className="w-full rounded-xl border px-3 py-3 text-sm cursor-not-allowed"
							style={{
								backgroundColor: 'var(--input-disabled-bg)',
								borderColor: 'var(--input-border)',
								color: 'var(--input-disabled-color)',
							}}
						/>
						<p
							className="mt-1 text-xs"
							style={{ color: 'var(--secondary-text)' }}
						>
							Task type is automatically determined from the
							project.
						</p>
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							variant="outline"
							onClick={() => {
								setIsFormOpen(false)
								setAppName(null)
							}}
							size="sm"
							className="theme-modal-btn-outline rounded-xl"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmGenApp}
							disabled={genLoading}
							size="sm"
							className="theme-modal-btn-primary rounded-xl"
						>
							{genLoading ? 'Processing...' : 'Confirm'}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
