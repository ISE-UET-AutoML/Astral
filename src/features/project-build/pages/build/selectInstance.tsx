import React from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { ArrowLeft as ArrowLeftOutlined } from 'lucide-react'
import { AutomaticInstancePanel } from 'src/features/project-build/components/instances/AutomaticInstancePanel'
import { ManualInstancePanel } from 'src/features/project-build/components/instances/ManualInstancePanel'
import { UserInfrastructurePanel } from 'src/features/project-build/components/instances/UserInfrastructurePanel'
import { useSelectInstance } from 'src/features/project-build/hooks/useSelectInstance'

const cx = (...classes) => classes.filter(Boolean).join(' ')
const Tabs = ({ items = [], activeKey, defaultActiveKey, onChange, className = '', ...props }) => { const [localKey, setLocalKey] = React.useState(defaultActiveKey || items[0]?.key); const selectedKey = activeKey ?? localKey; const selected = items.find((item) => item.key === selectedKey); return <div className={className} {...props}><div className="mb-4 flex gap-2 border-b">{items.map((item) => <button key={item.key} type="button" className={cx('px-3 py-2 text-sm', selectedKey === item.key && 'border-b-2 border-primary font-medium')} onClick={() => { setLocalKey(item.key); onChange?.(item.key) }}>{item.label}</button>)}</div>{selected?.children}</div> }

const SelectInstance = () => {
	const {
		projectInfo,
		updateFields,
		selectedProject,
		trainingTags = [],
	} = useOutletContext()
	const navigate = useNavigate()
	const selectedTrainingTags = Array.isArray(trainingTags) ? trainingTags : []
	const {
		activeTab,
		setActiveTab,
		isLoading,
		setIsLoading,
		isCreatingInstance,
		setIsCreatingInstance,
		isProcessing,
		formData,
		setFormData,
		instanceInfo,
		setInstanceInfo,
		sshKey,
		setSshKey,
		infrastructureData,
		setInfrastructureData,
		handleCopyToClipboard,
		handleInfrastructureChange,
		handleTrainingTimeChange,
		handleGpuNumberChange,
		handleDiskChange,
		handleManualConfigChange,
		handleStartTraining,
	} = useSelectInstance({
		projectInfo,
		selectedProject,
		updateFields,
		navigate,
		trainingTags: selectedTrainingTags,
	})

	const projectId = projectInfo?.id ?? projectInfo?._id
	const canGoBackToTrainingMode = Boolean(selectedProject?.dataset_id)

	const handleBackToTrainingMode = () => {
		if (!projectId || isProcessing) return
		navigate(`/app/project/${projectId}/build/chooseTrainingMode`)
	}

	const items = [
		{
			key: 'automatic',
			label: <span>⚡Automatic Configuration</span>,
			children: (
				<AutomaticInstancePanel
					formData={formData}
					setFormData={setFormData}
					isProcessing={isProcessing}
					onStartTraining={handleStartTraining}
					handleTrainingTimeChange={handleTrainingTimeChange}
				/>
			),
		},
		{
			key: 'manual',
			label: <span>🛠️Manual Configuration</span>,
			children: (
				<ManualInstancePanel
					formData={formData}
					handleTrainingTimeChange={handleTrainingTimeChange}
					handleManualConfigChange={handleManualConfigChange}
					handleGpuNumberChange={handleGpuNumberChange}
					handleDiskChange={handleDiskChange}
					isProcessing={isProcessing}
					onStartTraining={handleStartTraining}
				/>
			),
		},
		{
			key: 'userInfras',
			label: <span>🏗️Your Infrastructure</span>,
			children: (
				<UserInfrastructurePanel
					formData={formData}
					handleTrainingTimeChange={handleTrainingTimeChange}
					sshKey={sshKey}
					onCopySshKey={handleCopyToClipboard}
					infrastructureData={infrastructureData}
					handleInfrastructureChange={handleInfrastructureChange}
					isProcessing={isProcessing}
					onStartTraining={handleStartTraining}
				/>
			),
		},
	]

	return (
		<div className="h-full overflow-y-auto bg-[var(--surface)] pl-6 font-poppins">
			{canGoBackToTrainingMode && (
				<div className="mb-2">
					<button
						type="default"
						icon={<ArrowLeftOutlined />}
						disabled={isProcessing}
						onClick={handleBackToTrainingMode}
						className="!bg-blue-500 !text-white hover:!bg-blue-600 hover:!border-blue-600 hover:!text-white disabled:!opacity-50 px-5 py-2 rounded-xl"
					>
						Back
					</button>
				</div>
			)}
			<div className="rounded-2xl bg-[var(--card-gradient)] p-4 shadow-[0_8px_32px_var(--input-shadow)] backdrop-blur-2xl">
				<Tabs items={items} onChange={(key) => setActiveTab(key)} />
			</div>
		</div>
	)
}

export default SelectInstance
