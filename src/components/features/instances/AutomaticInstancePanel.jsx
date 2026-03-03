import React from 'react'
import { Card, Slider, Space, Typography, Row, Col } from 'antd'
import {
	INSTANCE_SIZE_DETAILS,
	InstanceSizeCard,
} from 'src/constants/clouldInstance'
import { InstanceMetricPill } from './InstanceMetricPill'
import { InstanceSummarySidebar } from './InstanceSummarySidebar'

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
					<Card className="dark-build-card rounded-lg shadow-sm">
						<Space
							direction="vertical"
							size="large"
							className="w-full"
						>
							<div>
								<Text className="dark-build-text-gradient ">
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
								<Text className="dark-build-text-gradient">
									Performance Level
								</Text>
								<div className="grid gap-4 mt-4">
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

