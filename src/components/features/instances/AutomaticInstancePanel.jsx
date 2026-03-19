import React from 'react'
import { Card, Slider, Space, Typography, Row, Col } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import {
	INSTANCE_SIZE_DETAILS,
	InstanceSizeCard,
} from 'src/constants/clouldInstance'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'
import { Wrench } from 'lucide-react'

const { Text } = Typography

export function AutomaticInstancePanel({
	formData,
	setFormData,
	isProcessing,
	onStartTraining,
	handleTrainingTimeChange,
}) {
	return (
		<Space
			direction="vertical"
			size="large"
			className="w-full rounded-lg shadow-sm"
		>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<Card className="dark-build-card !rounded-xl !border-0 shadow-md bg-[var(--card-gradient)]">
						<Space
							direction="vertical"
							size="large"
							className="w-full"
						>
							<Card
								size="small"
								title={
									<span className="font-semibold text-[var(--text)] text-lg">
										<ClockCircleOutlined className="text-[var(--accent-text)] mr-2" />
										Training Duration
									</span>
								}
								className="rounded-xl !border-0 bg-[var(--hover-bg)]"
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
								<div className="flex items-center gap-2 mb-4">
									<Wrench className="shrink-0 text-[var(--accent-text)]" size={20} />
									<span className="dark-build-text-gradient text-lg font-semibold text-[var(--text)]">
										Performance Level
									</span>
								</div>
								<div className="grid gap-4">
									{Object.entries(INSTANCE_SIZE_DETAILS).map(
										([size, details]) => (
											<InstanceSizeCard
												key={size}
												size={size}
												details={details}
												selected={
													formData.instanceSize === size
												}
												onClick={() => {
													const defaultTrainingTimes = {
														Weak: 2,
														Medium: 4,
														Strong: 6,
														'Super Strong': 8,
														Rocket: 12,
													}

													setFormData((prev) => ({
														...prev,
														gpuNumber:
															details
																.instanceDetails
																.gpuNumber,
														gpuName:
															details
																.instanceDetails
																.name,
														disk: details
															.instanceDetails
															.disk,
														cost: details
															.instanceDetails
															.cost,
														instanceSize: size,
														trainingTime:
															defaultTrainingTimes[
																size
															] ||
															prev.trainingTime,
														budget: (
															details
																.instanceDetails
																.cost *
															(defaultTrainingTimes[
																size
															] ||
																prev.trainingTime)
														).toFixed(2),
													}))
												}}
											/>
										)
									)}
								</div>
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

