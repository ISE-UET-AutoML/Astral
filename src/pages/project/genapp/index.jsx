import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllDeployedModel, genApp } from 'src/api/deploy'
import { getProjectById } from 'src/api/project'
import { useGenApps } from 'src/hooks/useGenApps'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from 'src/components/ui/card'
import { Button } from 'src/components/ui/button'
import { CustomSelect, Option } from 'src/components/ui/custom-select'
import Modal from 'src/components/Modal'
import BackgroundShapes from 'src/components/landing/BackgroundShapes'
import { useTheme } from 'src/theme/ThemeProvider'
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
	const { theme } = useTheme()
	const { apps, loading, error, refetch } = useGenApps(projectId)
	const [projectInfo, setProjectInfo] = useState(null)
	const [deploys, setDeploys] = useState([])
	const [selectedModelId, setSelectedModelId] = useState(null)
	const [genLoading, setGenLoading] = useState(false)
	const [appName, setAppName] = useState('')
	const [isFormOpen, setIsFormOpen] = useState(false)

	const fetchDeploys = async () => {
		try {
			const { data } = await getAllDeployedModel(projectId)
			const sorted = (data || []).sort(
				(a, b) => (b.id ?? 0) - (a.id ?? 0)
			)
			setDeploys(sorted)

			// Auto-select first deploy and prefill app name
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

	return (
		<div className="relative min-h-screen bg-gray-50 dark:bg-slate-900">
			{theme === 'dark' && <BackgroundShapes />}
			<div className="relative z-10 p-6">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-600">
							<AppIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
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
				<Card className="rounded-2xl shadow-2xl mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
							<span className="w-2 h-2 rounded-full bg-blue-500" />
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
									className="bg-blue-600 hover:bg-blue-700 text-white"
								>
									Go to Deploy page
								</Button>
							</div>
						) : (
							<div className="flex flex-wrap gap-4 items-end">
								<div className="flex-1 min-w-[200px]">
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Model
									</label>
									<CustomSelect
										value={selectedModelId}
										onChange={(val) => {
											setSelectedModelId(val)
											const found = deploys.find(
												(d) => d.model_id === val
											)
											if (found) {
												setAppName(found.name ?? '')
											}
										}}
										placeholder="Select a model..."
										className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
									>
										{deploys.map((d) => (
											<Option
												key={d.model_id}
												value={d.model_id}
											>
												{d.name ??
													`Model #${d.model_id}`}{' '}
												(ID: {d.model_id})
											</Option>
										))}
									</CustomSelect>
								</div>
								<Button
									onClick={() => setIsFormOpen(true)}
									disabled={!selectedModelId}
									className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
								>
									Gen App
								</Button>
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
					<Card className="rounded-2xl shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
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
								onViewDetails={(app) => {
									// Navigate to code editor page for this app
									navigate(
										`/app/project/${projectId}/my-apps/${app.run_id}/edit`
									)
								}}
							/>
						))}
					</div>
				) : (
					<Card className="rounded-2xl shadow-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
						<CardContent className="flex flex-col items-center justify-center py-16">
							<div className="p-4 rounded-full mb-4 bg-blue-50 dark:bg-blue-500/10">
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
						<CustomSelect
							value={selectedModelId}
							onChange={(val) => {
								setSelectedModelId(val)
								const found = deploys.find(
									(d) => d.model_id === val
								)
								if (found) {
									setAppName(found.name ?? '')
								}
							}}
							className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white"
						>
							{deploys.map((d) => (
								<Option key={d.model_id} value={d.model_id}>
									{d.name ?? `Model #${d.model_id}`} (ID:{' '}
									{d.model_id})
								</Option>
							))}
						</CustomSelect>
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
							className="w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							className="w-full rounded-2xl border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-800 px-3 py-3 text-sm text-gray-500 dark:text-gray-300 cursor-not-allowed"
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
							className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
						>
							{genLoading ? 'Processing...' : 'Confirm'}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	)
}
