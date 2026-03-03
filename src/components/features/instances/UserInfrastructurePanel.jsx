import React from 'react'
import {
	Card,
	Slider,
	Space,
	Typography,
	Row,
	Col,
	Input,
	InputNumber,
	Button,
} from 'antd'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'

const { Text } = Typography

export function UserInfrastructurePanel({
	formData,
	handleTrainingTimeChange,
	sshKey,
	onCopySshKey,
	infrastructureData,
	handleInfrastructureChange,
	isProcessing,
	onStartTraining,
}) {
	return (
		<Space
			direction="vertical"
			size="large"
			className="w-full rounded-lg shadow-sm"
		>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<Card className="dark-build-card rounded-lg shadow-sm">
						<Space
							direction="vertical"
							size="large"
							className="w-full"
						>
							<div>
								<Text className="dark-build-text-gradient">
									Training Duration
								</Text>
								<div className="flex items-center gap-4 mt-2">
									<Slider
										className="dark-build-slider flex-1"
										min={0}
										max={24}
										step={0.5}
										value={formData.trainingTime || 0}
										onChange={handleTrainingTimeChange}
										tooltip={{ open: false }}
									/>
									<InstanceMetricPill
										value={formData.trainingTime || 0}
										suffix="hours"
									/>
								</div>
								<Text className="dark-build-text">
									Recommended: 1-24 hours for most models
								</Text>
							</div>

							<div>
								<Space
									direction="vertical"
									size="middle"
									className="w-full"
								>
									<div>
										<Text className="dark-build-text">
											SSH Public Key
										</Text>
										<Input.TextArea
											className="dark-build-input"
											value={sshKey}
											rows={2}
											readOnly
										/>
										<Button
											onClick={onCopySshKey}
											type="primary"
											className="mt-2"
										>
											Copy
										</Button>
									</div>
									<div>
										<Text className="dark-build-text">
											Instance ID
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.id}
											onChange={(e) =>
												handleInfrastructureChange('id')(
													e.target.value
												)
											}
											placeholder="Enter instance ID"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											SSH Port
										</Text>
										<InputNumber
											className="dark-build-input w-full mt-2"
											value={infrastructureData.sshPort}
											onChange={handleInfrastructureChange(
												'sshPort'
											)}
											min={1}
											max={65535}
											placeholder="Enter SSH port"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Public IP
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.publicIP}
											onChange={(e) =>
												handleInfrastructureChange(
													'publicIP'
												)(e.target.value)
											}
											placeholder="Enter public IP"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Deploy Port
										</Text>
										<InputNumber
											className="dark-build-input w-full mt-2"
											value={infrastructureData.deployPort}
											onChange={handleInfrastructureChange(
												'deployPort'
											)}
											min={1}
											max={65535}
											placeholder="Enter deploy port"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Username
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.username}
											onChange={(e) =>
												handleInfrastructureChange(
													'username'
												)(e.target.value)
											}
											placeholder="Enter username"
										/>
									</div>
									<div>
										<Text className="dark-build-text">
											Dataset Path
										</Text>
										<Input
											className="dark-build-input mt-2"
											value={infrastructureData.datasetPath}
											onChange={(e) =>
												handleInfrastructureChange(
													'datasetPath'
												)(e.target.value)
											}
											placeholder="Enter dataset path"
										/>
									</div>
								</Space>
							</div>
						</Space>
					</Card>
				</Col>

				<Col span={8}>
					<InstanceSummarySidebar
						formData={formData}
						isProcessing={isProcessing}
						onStartTraining={onStartTraining}
					/>
				</Col>
			</Row>
		</Space>
	)
}

