import React from 'react'
import {
	Card,
	Slider,
	Space,
	Typography,
	Row,
	Col,
	Select,
} from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import {
	SERVICES,
	GPU_LEVELS,
} from 'src/constants/clouldInstance'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'

const { Text } = Typography
const { Option } = Select

export function ManualInstancePanel({
	formData,
	handleTrainingTimeChange,
	handleManualConfigChange,
	handleGpuNumberChange,
	handleDiskChange,
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
							<Card
								size="small"
								title={
									<span className="font-semibold text-[var(--text)]">
										<ClockCircleOutlined className="text-[var(--accent-text)] mr-2" />
										Training Duration
									</span>
								}
								className="rounded-xl border border-[var(--border)] bg-[var(--hover-bg)]"
							>
								<div className="flex flex-col gap-4">
									<div className="flex items-center gap-4">
										<Slider
											className="dark-build-slider flex-1 min-w-0"
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
									<Text className="text-[var(--secondary-text)] text-sm">
										Recommended: 1-24 hours for most models
									</Text>
								</div>
							</Card>

							<div>
								<Text className="dark-build-text-gradient">
									Manual Configuration
								</Text>
								<Space
									direction="vertical"
									size="middle"
									className="w-full mt-4"
								>
									<div>
										<Text className="dark-build-text">
											Service Provider
										</Text>
										<Select
											className="dark-build-select w-full mt-2"
											value={formData.service}
											onChange={handleManualConfigChange(
												'service'
											)}
										>
											{SERVICES.map((service) => (
												<Option
													key={service.name}
													value={service.name}
												>
													{service.name} -{' '}
													{service.description}
												</Option>
											))}
										</Select>
									</div>

									<div>
										<Text className="dark-build-text">
											GPU Type
										</Text>
										<Select
											className="dark-build-select w-full mt-2"
											value={formData.gpuName}
											onChange={handleManualConfigChange(
												'gpuName'
											)}
										>
											{GPU_LEVELS.map((gpu) => (
												<Option
													key={gpu.name}
													value={gpu.name}
												>
													{gpu.name} ({gpu.memory})
												</Option>
											))}
										</Select>
									</div>

									<div>
										<Text className="dark-build-text">
											Number of GPUs
										</Text>
										<div className="flex items-center gap-4 mt-2">
											<Slider
												className="dark-build-slider flex-1"
												min={1}
												max={8}
												step={1}
												value={formData.gpuNumber}
												onChange={
													handleGpuNumberChange
												}
												tooltip={{ open: false }}
											/>
											<InstanceMetricPill
												value={formData.gpuNumber}
												suffix="GPUs"
											/>
										</div>
									</div>

									<div>
										<Text className="dark-build-text">
											Disk Space
										</Text>
										<div className="flex items-center gap-4 mt-2">
											<Slider
												className="dark-build-slider flex-1"
												min={10}
												max={1000}
												step={10}
												value={formData.disk}
												onChange={handleDiskChange}
												tooltip={{ open: false }}
											/>
											<InstanceMetricPill
												value={formData.disk}
												suffix="GB"
											/>
										</div>
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

