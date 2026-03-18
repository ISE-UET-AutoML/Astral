import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getAllExperiments } from 'src/api/experiment'
import { getAllDeployedModel } from 'src/api/deploy'
import { getModels } from 'src/api/model'
import StatusCard from 'src/components/features/projects/StatusCard'
import MetaDataItem from 'src/components/features/projects/MetaDataItem'

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
	}, [projectInfo])

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

	return (
		<>
			<div className="h-full overflow-y-auto flex items-center" style={{ background: 'var(--surface)' }}>
				<div className="relative w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
					<div className="relative z-10 max-w-7xl mx-auto w-full">
						<div className="mb-6 lg:mb-8 text-center">
							<h1
								className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4 leading-tight"
								style={{ color: 'var(--title-project)' }}
							>
								Project Overview
							</h1>
							<p
								className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed"
								style={{ color: 'var(--secondary-text)' }}
							>
								{projectInfo?.description ||
									'Comprehensive overview of your project metrics and deployment status'}
							</p>
						</div>

						<div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 items-start">
							<div className="xl:col-span-4">
								<div>
									<div
										className="p-5 lg:p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col"
										style={{
											borderColor: 'var(--border)',
											background: 'var(--card-gradient)',
										}}
									>
										<div className="flex items-center space-x-3 mb-5">
											<div className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/10">
												<SettingOutlined
													className="text-lg"
													style={{ color: 'var(--accent-text)' }}
												/>
											</div>
											<h2
												className="text-lg lg:text-xl font-bold"
												style={{ color: 'var(--text)' }}
											>
												Project Details
											</h2>
										</div>

										<div className="space-y-3">
											<MetaDataItem
												label="Project name"
												value={projectInfo?.name}
											/>
											<MetaDataItem
												label="Task Type"
												value={projectInfo?.task_type}
											/>
											<MetaDataItem
												label="Expected Accuracy"
												value={
													projectInfo?.expected_accuracy
												}
											/>
											<MetaDataItem
												label="Visibility"
												value={projectInfo?.visibility}
											/>
											<MetaDataItem
												label="Created"
												value={formattedDate}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="xl:col-span-8 flex flex-col gap-5 lg:gap-6">
								<div
									className="p-5 lg:p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col"
									style={{
										borderColor: 'var(--border)',
										background: 'var(--card-gradient)',
									}}
								>
									<div className="flex items-center space-x-3 mb-5">
										<div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10">
											<ExperimentOutlined
												className="text-xl"
												style={{ color: 'var(--accent-text)' }}
											/>
										</div>
										<div>
											<h3
												className="text-xl lg:text-2xl font-bold"
												style={{ color: 'var(--text)' }}
											>
												Experiments
											</h3>
											<p
												className="text-sm opacity-70"
												style={{ color: 'var(--secondary-text)' }}
											>
												Training and validation status
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
									className="p-5 lg:p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col"
									style={{
										borderColor: 'var(--border)',
										background: 'var(--card-gradient)',
									}}
								>
									<div className="flex items-center space-x-3 mb-5">
										<div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10">
											<DatabaseOutlined
												className="text-xl"
												style={{ color: 'var(--accent-text)' }}
											/>
										</div>
										<div>
											<h3
												className="text-xl lg:text-2xl font-bold"
												style={{ color: 'var(--text)' }}
											>
												Models
											</h3>
											<p
												className="text-sm opacity-70"
												style={{ color: 'var(--secondary-text)' }}
											>
												Available trained models
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
									className="p-5 lg:p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col"
									style={{
										borderColor: 'var(--border)',
										background: 'var(--card-gradient)',
									}}
								>
									<div className="flex items-center space-x-3 mb-5">
										<div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10">
											<CloudOutlined
												className="text-xl"
												style={{ color: 'var(--accent-text)' }}
											/>
										</div>
										<div>
											<h3
												className="text-xl lg:text-2xl font-bold"
												style={{ color: 'var(--text)' }}
											>
												Deployed Models
											</h3>
											<p
												className="text-sm opacity-70"
												style={{ color: 'var(--secondary-text)' }}
											>
												Production deployment status
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
