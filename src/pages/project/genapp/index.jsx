import { useEffect, useState } from 'react'
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
} from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { Select } from 'src/components/ui/select'
import Modal from 'src/components/Modal'
import { message } from 'antd'
import { PATHS } from 'src/constants/paths'
import AppCard from 'src/components/GenApp/AppCard'

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
	const { apps, loading, error, refetch } = useGenApps(projectId)
	const [projectInfo, setProjectInfo] = useState(null)
	const [deploys, setDeploys] = useState([])
	const [selectedModelId, setSelectedModelId] = useState(null)
	const [genLoading, setGenLoading] = useState(false)
	const [appName, setAppName] = useState('')
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [modelMetadata, setModelMetadata] = useState(null)
	const [selectedDeploy, setSelectedDeploy] = useState(null)

	const fetchDeploys = async () => {
		try {
			const { data } = await getAllDeployedModel(projectId)
			const onlineDeploys = (data || []).filter(
				(d) => d.status === 'ONLINE'
			)
			const sorted = onlineDeploys.sort(
				(a, b) => (b.id ?? 0) - (a.id ?? 0)
			)
			setDeploys(sorted)

			if (sorted.length > 0 && !selectedModelId) {
				setSelectedModelId(sorted[0].model_id)
				setAppName(sorted[0].name ?? '')
			}
		} catch (e) {
			message.error('Không tải được danh sách deploy')
		}
	}

	useEffect(() => {
		fetchDeploys()
	}, [projectId])

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

	// Fetch model metadata when selectedModelId changes
	useEffect(() => {
		const fetchMetadata = async () => {
			if (!selectedModelId) {
				setModelMetadata(null)
				setSelectedDeploy(null)
				return
			}

			try {
				const deploy = deploys.find(
					(d) => d.model_id === selectedModelId
				)
				setSelectedDeploy(deploy)

				const modelRes =
					await getLatestModelVersionByModelId(selectedModelId)
				setModelMetadata(modelRes.data)

				if (deploy?.id) {
					const deployRes = await getDeployData(deploy.id)
					setSelectedDeploy(deployRes.data)
				}
			} catch (e) {
				console.error('Failed to fetch model metadata', e)
			}
		}
		fetchMetadata()
	}, [selectedModelId, deploys])

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
				name: appName,
				taskType: resolveTaskType(),
				metadata: buildMetadata(),
			})
			message.success('Gen app successfully')
			refetch()
			setIsFormOpen(false)
			setAppName('')
		} catch (e) {
			message.error('Gen app failed')
		} finally {
			setGenLoading(false)
		}
	}
	console.log("Gen app:", apps);

	return (
		<div className="relative min-h-screen bg-gray-50" style={{ background: 'var(--surface)' }}>
			<div className="relative z-10 p-6">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-xl bg-gray-200 dark:bg-[#2a2a2c]">
							<AppIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								My Apps
							</h1>
							<p className="mt-1 text-gray-500 dark:text-gray-400">
								{loading
									? '...'
									: `${apps.length} app generated`}
							</p>
						</div>
					</div>
				</div>

				{/* Gen App: chọn deploy_id rồi bấm Gen App */}
				<Card className="rounded-2xl shadow-2xl mb-6" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
							<span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
							Gen App
						</CardTitle>
						<CardDescription className="text-gray-500 dark:text-gray-400">
							Select a model and click Gen App to create an app
							from the model.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{deploys.length === 0 ? (
							<div className="flex flex-col gap-4">
								<p className="text-gray-600 dark:text-gray-300">
									No model found. Please deploy a model first.
								</p>
								<Button
									onClick={() =>
										navigate(
											PATHS.PROJECT_DEPLOY(projectId)
										)
									}
									className="bg-gray-600 hover:bg-gray-500 text-white"
								>
									Go to Deploy page
								</Button>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Model
									</label>
									<Select
										value={selectedModelId ?? ''}
										onChange={(e) => {
											const val = e.target.value || null
											setSelectedModelId(val)
											const found = deploys.find(
												(d) => d.model_id === val
											)
											if (found) {
												setAppName(found.name ?? '')
											}
										}}
										className="bg-gray-50 dark:bg-[#1e1e1e] border-gray-200 dark:border-[#333] text-gray-900 dark:text-white"
									>
										<option value="" disabled>
											Select a model...
										</option>
										{deploys.map((d) => (
											<option
												key={d.model_id}
												value={d.model_id}
											>
												{d.name ??
													`Model #${d.model_id}`}{' '}
												(ID: {d.model_id})
											</option>
										))}
									</Select>
								</div>
								<div>
									<Button
										onClick={() => setIsFormOpen(true)}
										disabled={!selectedModelId}
										className="w-full bg-gray-600 hover:bg-gray-500 text-white disabled:opacity-50"
									>
										Gen App
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

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
					<Card className="rounded-2xl shadow-2xl" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
						<CardContent className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
							Loading...
						</CardContent>
					</Card>
				) : apps.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{apps.map((app, i) => (
							<AppCard
								key={app.id ?? i}
								app={app}
								onViewDetails={async (app) => {
									// Init draft before navigating so workspace is ready on edit page
									try {
										await initDraft(app.id)
									} catch (e) {
										console.warn('[GenApp] initDraft before nav:', e)
									}
									navigate(
										`/app/project/${projectId}/my-apps/${app.id}/edit`
									)
								}}
							/>
						))}
					</div>
				) : (
					<Card className="rounded-2xl shadow-2xl" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
						<CardContent className="flex flex-col items-center justify-center py-16">
							<div className="p-4 rounded-full mb-4 bg-gray-100 dark:bg-[#2a2a2c]">
								<EmptyIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
							</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
								You haven't generated any apps yet
							</h3>
							<p className="text-center max-w-md text-gray-500 dark:text-gray-400">
								Select a model and click Gen App to create your
								first app.
							</p>
						</CardContent>
					</Card>
				)}
			</div>

			{/* Modal form để điền thông tin app */}
			<Modal
				open={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				title="Gen App Configuration"
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Model
						</label>
						<Select
							value={selectedModelId ?? ''}
							onChange={(e) => {
								const val = e.target.value || null
								setSelectedModelId(val)
								const found = deploys.find(
									(d) => d.model_id === val
								)
								if (found) {
									setAppName(found.name ?? '')
								}
							}}
							className="bg-gray-50 dark:bg-[#1e1e1e] border-gray-200 dark:border-[#333] text-gray-900 dark:text-white"
						>
							<option value="" disabled>
								Select a model...
							</option>
							{deploys.map((d) => (
								<option key={d.model_id} value={d.model_id}>
									{d.name ?? `Model #${d.model_id}`} (ID:{' '}
									{d.model_id})
								</option>
							))}
						</Select>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							App name
						</label>
						<input
							type="text"
							value={appName}
							onChange={(e) => setAppName(e.target.value)}
							placeholder="Please enter the app name"
							className="w-full rounded-xl border border-gray-300 dark:border-[#333] bg-white dark:bg-[#1e1e1e] px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Task type
						</label>
						<input
							type="text"
							value={
								resolveTaskType() === 'object_detection'
									? 'Object Detection'
									: resolveTaskType() ===
										'text_classification'
										? 'Text Classification'
										: 'Image Classification'
							}
							readOnly
							className="w-full rounded-2xl border border-gray-300 dark:border-[#333] bg-gray-100 dark:bg-[#222] px-3 py-3 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
						/>
						<p className="mt-1 text-xs text-gray-400">
							Task type is automatically determined from the
							project.
						</p>
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<Button
							variant="outline"
							onClick={() => setIsFormOpen(false)}
							className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmGenApp}
							disabled={genLoading}
							className="bg-gray-600 hover:bg-gray-500 text-white disabled:opacity-50"
						>
							{genLoading ? 'Processing...' : 'Confirm'}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
