import React from 'react'
import {
    useSearchParams,
    useOutletContext,
    useNavigate,
} from 'react-router-dom'
import {
    Card,
    Tabs,
    Slider,
    InputNumber,
    Button,
    Space,
    Typography,
    message,
    Steps,
    Row,
    Col,
    Collapse,
    Select,
    Input,
    Spin,
    Modal,
} from 'antd'
import {
    ThunderboltOutlined,
    CloudDownloadOutlined,
    SettingOutlined,
    RocketOutlined,
} from '@ant-design/icons'
import { GPU_LEVELS } from 'src/constants/clouldInstance'
import { InstanceMetricPill } from 'src/components/features/instances/InstanceMetricPill'
import { AutomaticInstancePanel } from 'src/components/features/instances/AutomaticInstancePanel'
import { ManualInstancePanel } from 'src/components/features/instances/ManualInstancePanel'
import { UserInfrastructurePanel } from 'src/components/features/instances/UserInfrastructurePanel'
import { useSelectInstance } from 'src/hooks/useSelectInstance'

const { Text } = Typography
const { Option } = Select

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
        <>
            <style>{`
                .dark-build-page {
                    background: transparent;
                    min-height: 100vh;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .dark-build-page * {
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .dark-build-tabs .ant-tabs-tab {
                    color: var(--tabs-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 500 !important;
                    font-size: 16px !important;
                }
                
                .dark-build-tabs .ant-tabs-tab:hover {
                    color: var(--accent-text) !important;
                }
                
                .dark-build-tabs .ant-tabs-tab-active {
                    color: var(--accent-text) !important;
                }
                
                .dark-build-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: var(--accent-text) !important;
                    font-weight: 600 !important;
                }
                
                .dark-build-tabs .ant-tabs-ink-bar {
                    background: var(--tabs-ink-bar) !important;
                    height: 3px !important;
                }
                
                .dark-build-tabs .ant-tabs-content-holder {
                    background: transparent !important;
                }
                
                .dark-build-card {
                    background: var(--card-gradient) !important;
                    backdrop-filter: blur(20px) !important;
                    border: 1px solid var(--border) !important;
                    border-radius: 20px !important;
                    box-shadow: 0 8px 32px var(--input-shadow) !important;
                }
                
                .dark-build-text {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 400 !important;
                }
                
                .dark-build-text-strong {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .dark-build-text-gradient {
                    background: var(--title-gradient) !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                    background-clip: text !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                    font-size: 20px !important;
                }
                
                .dark-build-slider .ant-slider-track {
                    background: var(--tabs-ink-bar) !important;
                    height: 6px !important;
                }
                
                .dark-build-slider .ant-slider-rail {
                    background: var(--border) !important;
                    height: 6px !important;
                }
                
                .dark-build-slider .ant-slider-handle {
                    border-color: var(--accent-text) !important;
                    width: 20px !important;
                    height: 20px !important;
                    margin-top: 0px !important;
                }
                
                .dark-build-slider .ant-slider-handle:hover {
                    border-color: var(--tabs-ink-bar) !important;
                }
                
                .dark-build-input .ant-input-number {
                    background: var(--input-bg) !important;
                    border: 1px solid var(--input-border) !important;
                    color: var(--input-color) !important;
                    border-radius: 12px !important;
                }
                
                .dark-build-input .ant-input-number:hover {
                    border-color: var(--input-focus-border) !important;
                    box-shadow: var(--input-shadow) !important;
                }
                
                .dark-build-input .ant-input-number-focused {
                    border-color: var(--input-focus-border) !important;
                    box-shadow: var(--input-shadow) !important;
                }
                
                .dark-build-input .ant-input-number-input {
                    color: var(--input-color) !important;
                    background: transparent !important;
                    font-size: 16px !important;
                    font-weight: 500 !important;
                }
                
                .dark-build-input .ant-input-number-addon {
                    color: var(--text) !important;
                    background: var(--hover-bg) !important;
                    border-color: var(--border) !important;
                    font-weight: 500 !important;
                }
                
                .dark-build-input .ant-input-number-addon .ant-input-number-addon-text {
                    color: var(--text) !important;
                }
                
                .dark-build-input .ant-input-number-addon-after {
                    color: var(--text) !important;
                    background: var(--hover-bg) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-build-input .ant-input-number-addon-after span {
                    color: var(--text) !important;
                }
                
                .dark-build-input .ant-input-number-addon-after {
                    color: var(--text) !important;
                }
                
                .dark-build-input .ant-input-number-addon-after * {
                    color: var(--text) !important;
                }
                
                .dark-build-input .ant-input-number .ant-input-number-addon-after {
                    color: var(--text) !important;
                    background: var(--hover-bg) !important;
                    border-color: var(--border) !important;
                }
                
                .dark-build-input .ant-input-number .ant-input-number-addon-after span {
                    color: var(--text) !important;
                }
                
                .dark-build-input .ant-input-number .ant-input-number-addon-after .ant-input-number-addon-text {
                    color: var(--text) !important;
                }
                
                .dark-build-select .ant-select-selector {
                    background: var(--select-selector-bg) !important;
                    border: 1px solid var(--select-selector-border) !important;
                    color: var(--select-selector-color) !important;
                    border-radius: 12px !important;
                }
                
                .dark-build-select .ant-select-selector:hover {
                    border-color: var(--input-focus-border) !important;
                    box-shadow: var(--input-shadow) !important;
                }
                
                .dark-build-select .ant-select-selection-item {
                    color: var(--select-item-color) !important;
                }
                
                .dark-build-select .ant-select-arrow {
                    color: var(--select-arrow-color) !important;
                }
                
                .dark-build-button {
                    background: var(--button-primary-bg) !important;
                    border: none !important;
                    border-radius: 12px !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                    box-shadow: 0 4px 16px var(--input-shadow) !important;
                    height: 48px !important;
                }
                
                .dark-build-button:hover {
                    background: var(--button-primary-bg) !important;
                    box-shadow: 0 6px 20px var(--input-shadow) !important;
                    transform: translateY(-2px) !important;
                }
                
                .dark-build-button:disabled {
                    box-shadow: none !important;
                    transform: none !important;
                    pointer-events: none !important;
                }
                
                .dark-build-modal .ant-modal-content {
                    background: var(--modal-bg) !important;
                    backdrop-filter: blur(20px) !important;
                    border: 1px solid var(--modal-border) !important;
                    border-radius: 20px !important;
                }
                
                .dark-build-modal .ant-modal-header {
                    background: var(--modal-header-bg) !important;
                    border-bottom: 1px solid var(--modal-header-border) !important;
                }
                
                .dark-build-modal .ant-modal-title {
                    color: var(--modal-title-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .dark-build-modal .ant-modal-body {
                    color: var(--text) !important;
                }
                
                .dark-build-statistic .ant-statistic-title {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .dark-build-statistic .ant-statistic-content {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .dark-build-statistic .ant-statistic-content-value {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .dark-build-cost-estimator {
                    background: var(--hover-bg) !important;
                    border: 1px solid var(--border) !important;
                    border-radius: 16px !important;
                    padding: 20px !important;
                }
                
                .dark-build-cost-estimator h4 {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .dark-build-cost-estimator p {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .instance-size-card {
                    background: var(--input-bg) !important;
                    border: 1px solid var(--border) !important;
                    border-radius: 16px !important;
                    transition: all 0.3s ease !important;
                    backdrop-filter: blur(10px) !important;
                }
                
                .instance-size-card:hover {
                    background: var(--hover-bg) !important;
                    border-color: var(--accent-text) !important;
                    box-shadow: 0 8px 24px var(--input-shadow) !important;
                    transform: translateY(-2px) !important;
                }
                
                .instance-size-card.selected {
                    background: var(--active-bg) !important;
                    border-color: var(--accent-text) !important;
                    box-shadow: 0 8px 24px var(--input-shadow) !important;
                }
                
                .instance-size-card .ant-card-body {
                    color: var(--text) !important;
                }
                
                .instance-size-card .ant-card-body h5 {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .instance-size-card .ant-card-body .ant-typography {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .instance-size-card .ant-collapse {
                    background: transparent !important;
                    border: none !important;
                }
                
                .instance-size-card .ant-collapse .ant-collapse-item {
                    border: none !important;
                }
                
                .instance-size-card .ant-collapse .ant-collapse-header {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                    background: transparent !important;
                    border: none !important;
                }
                
                .instance-size-card .ant-collapse .ant-collapse-content {
                    background: transparent !important;
                    border: none !important;
                }
                
                .instance-size-card .ant-collapse .ant-collapse-content-box {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                /* Input and TextArea styling - More specific selectors */
                .dark-build-input .ant-input,
                .dark-build-input .ant-input-textarea,
                .dark-build-input .ant-input-affix-wrapper,
                .dark-build-input .ant-input-affix-wrapper .ant-input {
                    background: var(--input-bg) !important;
                    border: 1px solid var(--input-border) !important;
                    color: var(--input-color) !important;
                    border-radius: 12px !important;
                }
                
                .dark-build-input .ant-input:hover,
                .dark-build-input .ant-input-textarea:hover,
                .dark-build-input .ant-input-affix-wrapper:hover,
                .dark-build-input .ant-input-affix-wrapper:hover .ant-input {
                    border-color: var(--input-hover-border) !important;
                }
                
                .dark-build-input .ant-input:focus,
                .dark-build-input .ant-input-textarea:focus,
                .dark-build-input .ant-input-affix-wrapper:focus,
                .dark-build-input .ant-input-affix-wrapper:focus .ant-input {
                    border-color: var(--input-focus-border) !important;
                }
                
                .dark-build-input .ant-input::placeholder,
                .dark-build-input .ant-input-textarea::placeholder,
                .dark-build-input .ant-input-affix-wrapper .ant-input::placeholder {
                    color: var(--placeholder-color) !important;
                }
                
                /* Force styling on all input elements */
                .dark-build-page input[type="text"],
                .dark-build-page textarea {
                    background: var(--input-bg) !important;
                    border: 1px solid var(--input-border) !important;
                    color: var(--input-color) !important;
                    border-radius: 12px !important;
                }
                
                .dark-build-page input[type="text"]:hover,
                .dark-build-page textarea:hover {
                    border-color: var(--input-hover-border) !important;
                }
                
                .dark-build-page input[type="text"]:focus,
                .dark-build-page textarea:focus {
                    border-color: var(--input-focus-border) !important;
                }
                
                .dark-build-page input[type="text"]::placeholder,
                .dark-build-page textarea::placeholder {
                    color: var(--placeholder-color) !important;
                }
                
                /* InputNumber specific styling */
                .dark-build-input .ant-input-number {
                    background: var(--input-bg) !important;
                    border: 1px solid var(--input-border) !important;
                    color: var(--input-color) !important;
                    border-radius: 12px !important;
                }
                
                .dark-build-input .ant-input-number:hover {
                    border-color: var(--input-hover-border) !important;
                }
                
                .dark-build-input .ant-input-number:focus,
                .dark-build-input .ant-input-number-focused {
                    border-color: var(--input-focus-border) !important;
                }
                
                .dark-build-input .ant-input-number-input {
                    background: transparent !important;
                    color: var(--input-color) !important;
                }
                
                .dark-build-input .ant-input-number-input::placeholder {
                    color: var(--placeholder-color) !important;
                }
            `}</style>
            <div className="dark-build-page font-poppins">
                <div className="select-instance-container p-6">
                    <Tabs
                        items={items}
                        onChange={(key) => setActiveTab(key)}
                        className="dark-build-tabs"
                    />
                </div>
            </div>
        </>
    )
}

export default SelectInstance
