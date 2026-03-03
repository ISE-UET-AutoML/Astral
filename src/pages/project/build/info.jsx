import { useEffect, useState } from 'react'
// BackgroundShapes removed
import { useOutletContext } from 'react-router-dom'
import { useTheme } from 'src/theme/ThemeProvider'
import { getAllExperiments } from 'src/api/experiment'
import { getAllDeployedModel } from 'src/api/deploy'
import { getModels } from 'src/api/model'

// Ant Design icons
import {
	CheckCircleOutlined,
	SyncOutlined,
	CloseCircleOutlined,
	CloudServerOutlined,
	SettingOutlined,
	ExperimentOutlined,
	DatabaseOutlined,
	CloudOutlined,
} from '@ant-design/icons'

const ProjectInfo = () => {
	const { theme } = useTheme()
	const { projectInfo } = useOutletContext()
	const [experiments, setExperiments] = useState([])
	const [models, setModels] = useState([])
	const [deployedModels, setDeployedModels] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const experimentsData = await getAllExperiments(projectInfo.id)

				const modelsData = await getModels(projectInfo.id)
				const deployedModelsData = await getAllDeployedModel(
					projectInfo.id
				)
				
				setExperiments(
					Array.isArray(experimentsData)
						? experimentsData
						: experimentsData.data || []
				)
				setModels(
					Array.isArray(modelsData)
						? modelsData
						: modelsData.data || []
				)
				setDeployedModels(
					Array.isArray(deployedModelsData)
						? deployedModelsData
						: deployedModelsData.data || []
				)
				console.log(projectInfo)
			} catch (error) {
				console.error('Error fetching project data:', error)
			}
		}

		if (projectInfo?.id) fetchData()
	}, [projectInfo]) // Updated dependency array to use the entire projectInfo object

	// Format created_at
	const formattedDate = new Date(projectInfo?.created_at).toLocaleString(
		'en-US',
		{
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}
	)

	const StatusCard = ({ label, value, color, Icon }) => (
		<div
			className="group relative overflow-hidden rounded-2xl border border-opacity-20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-opacity-40 [border-color:var(--border)] bg-[linear-gradient(135deg,var(--hover-bg)_0%,rgba(255,255,255,0.02)_100%)]"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
			<div className="relative flex items-center space-x-4 p-6">
				<div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
					<Icon
						className="text-2xl text-[var(--accent-text)] transition-transform duration-300 group-hover:scale-110"
					/>
				</div>
				<div className="flex-1 min-w-0">
					<p className="mb-1 text-sm font-medium opacity-70 text-[var(--secondary-text)]">
						{label}
					</p>
					<p className="text-2xl font-bold tracking-tight text-[var(--text)]">
						{value}
					</p>
				</div>
			</div>
		</div>
	)

	const MetadataItem = ({ label, value }) => (
		<div className="flex flex-col space-y-1 p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 transition-all duration-200 hover:bg-white/10">
			<span
				className="text-xs font-medium uppercase tracking-wider opacity-60 text-[var(--secondary-text)]"
			>
				{label}
			</span>
			<span
				className="text-sm font-semibold text-[var(--text)]"
			>
				{value}
			</span>
		</div>
	)

	return (
		<>
			<div className="min-h-screen bg-[var(--surface)]">
				<div className="relative pt-16 px-4 sm:px-6 lg:px-8 pb-20">
					<div className="relative z-10 max-w-7xl mx-auto">
						<div className="mb-16 text-center">
							<h1
								className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[var(--title-project)]"
							>
								{projectInfo?.name || 'Project Info'}
							</h1>
							<p className="mx-auto max-w-3xl text-lg sm:text-xl leading-relaxed text-[var(--secondary-text)]">
								{projectInfo?.description ||
									'Comprehensive overview of your project metrics and deployment status'}
							</p>
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
							<div className="xl:col-span-4">
								<div className="sticky top-8">
									<div
										className="p-8 rounded-3xl border backdrop-blur-xl shadow-2xl [border-color:var(--border)] [background:var(--card-gradient)]"
									>
										<div className="flex items-center space-x-3 mb-8">
											<div className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/10">
												<SettingOutlined
													className="text-xl text-[var(--accent-text)]"
												/>
											</div>
											<h2
												className="text-xl font-bold text-[var(--text)]"
											>
												Project Details
											</h2>
										</div>

										<div className="space-y-4">
											<MetadataItem
												label="Project ID"
												value={projectInfo?.id}
											/>
											<MetadataItem
												label="Task Type"
												value={projectInfo?.task_type}
											/>
											<MetadataItem
												label="Expected Accuracy"
												value={
													projectInfo?.expected_accuracy
												}
											/>
											<MetadataItem
												label="Visibility"
												value={projectInfo?.visibility}
											/>
											<MetadataItem
												label="Created"
												value={formattedDate}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="xl:col-span-8 space-y-8">
								<div
									className="p-8 rounded-3xl border backdrop-blur-xl shadow-2xl [border-color:var(--border)] [background:var(--card-gradient)]"
								>
									<div className="flex items-center space-x-3 mb-8">
										<div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10">
											<ExperimentOutlined
												className="text-2xl text-[var(--accent-text)]"
											/>
										</div>
										<div>
											<h3
												className="text-2xl font-bold text-[var(--text)]"
											>
												Experiments
											</h3>
											<p
												className="text-sm opacity-70 text-[var(--secondary-text)]"
											>
												Training and validation status
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										<StatusCard
											label="Completed"
											value={
												experiments.filter(
													(e) => e.status === 'DONE'
												).length
											}
											color={{
												bg: 'bg-green-500/10',
												border: 'border-green-400/30',
												text: 'text-green-300',
											}}
											Icon={CheckCircleOutlined}
										/>
										<StatusCard
											label="In Progress"
											value={
												experiments.filter(
													(e) =>
														e.status === 'TRAINING' || 
													    e.status === 'SETTING_UP' ||
														e.status === 'CREATING_INSTANCE' ||
														e.status === 'DOWNLOADING_DATA' ||
														e.status === 'DOWNLOADING_DEPENDENCIES'
												).length
											}
											color={{
												bg: 'bg-blue-500/10',
												border: 'border-blue-400/30',
												text: 'text-blue-300',
											}}
											Icon={SyncOutlined}
										/>
										<StatusCard
											label="Failed"
											value={
												experiments.filter(
													(e) => e.status === 'FAILED'
												).length
											}
											color={{
												bg: 'bg-red-500/10',
												border: 'border-red-400/30',
												text: 'text-red-300',
											}}
											Icon={CloseCircleOutlined}
										/>
									</div>
								</div>

								<div
									className="p-8 rounded-3xl border backdrop-blur-xl shadow-2xl [border-color:var(--border)] [background:var(--card-gradient)]"
								>
									<div className="flex items-center space-x-3 mb-8">
										<div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10">
											<DatabaseOutlined
												className="text-2xl text-[var(--accent-text)]"
											/>
										</div>
										<div>
											<h3
												className="text-2xl font-bold text-[var(--text)]"
											>
												Models
											</h3>
											<p
												className="text-sm opacity-70 text-[var(--secondary-text)]"
											>
												Available trained models
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										<StatusCard
											label="Ready"
											value={models.length}
											color={{
												bg: 'bg-green-500/10',
												border: 'border-green-400/30',
												text: 'text-green-300',
											}}
											Icon={CheckCircleOutlined}
										/>
									</div>
								</div>

								<div
									className="p-8 rounded-3xl border backdrop-blur-xl shadow-2xl [border-color:var(--border)] [background:var(--card-gradient)]"
								>
									<div className="flex items-center space-x-3 mb-8">
										<div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10">
											<CloudOutlined
												className="text-2xl text-[var(--accent-text)]"
											/>
										</div>
										<div>
											<h3
												className="text-2xl font-bold text-[var(--text)]"
											>
												Deployed Models
											</h3>
											<p
												className="text-sm opacity-70 text-[var(--secondary-text)]"
											>
												Production deployment status
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										<StatusCard
											label="Online"
											value={
												deployedModels.filter(
													(d) => d.status === 'ONLINE'
												).length
											}
											color={{
												bg: 'bg-green-500/10',
												border: 'border-green-400/30',
												text: 'text-green-300',
											}}
											Icon={CloudServerOutlined}
										/>
										<StatusCard
											label="Setting Up"
											value={
												deployedModels.filter(
													(d) =>
														d.status ===
														'SETTING_UP'
												).length
											}
											color={{
												bg: 'bg-blue-500/10',
												border: 'border-blue-400/30',
												text: 'text-blue-300',
											}}
											Icon={SettingOutlined}
										/>
										<StatusCard
											label="Offline"
											value={
												deployedModels.filter(
													(d) =>
														d.status === 'OFFLINE'
												).length
											}
											color={{
												bg: 'bg-red-500/10',
												border: 'border-red-400/30',
												text: 'text-red-300',
											}}
											Icon={CloseCircleOutlined}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProjectInfo
