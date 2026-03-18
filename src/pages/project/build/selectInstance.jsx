import React from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Tabs } from 'antd'
import { AutomaticInstancePanel } from 'src/components/features/instances/AutomaticInstancePanel'
import { ManualInstancePanel } from 'src/components/features/instances/ManualInstancePanel'
import { UserInfrastructurePanel } from 'src/components/features/instances/UserInfrastructurePanel'
import { useSelectInstance } from 'src/hooks/useSelectInstance'

const SelectInstance = () => {
    const { projectInfo, updateFields, selectedProject } = useOutletContext()
    const navigate = useNavigate()
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
    })

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
        <div className="min-h-screen bg-[var(--surface)] px-6 py-6 font-poppins">
            <div className="rounded-2xl bg-[var(--card-gradient)] p-4 shadow-[0_8px_32px_var(--input-shadow)] backdrop-blur-2xl">
                <Tabs items={items} onChange={(key) => setActiveTab(key)} />
            </div>
        </div>
    )
}

export default SelectInstance
