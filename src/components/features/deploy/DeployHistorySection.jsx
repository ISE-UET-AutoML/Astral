import React from 'react'
import { Card, List, Button, Tooltip } from 'antd'
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { formatDistanceToNow, format } from 'date-fns'

export function DeployHistorySection({
	recentPredictions,
	isLoadingPredictions,
	onViewPrediction,
}) {
	return (
		<div className="mt-8">
			<Card
				title={
					<div className="flex items-center gap-2">
						<ClockCircleOutlined className="text-[var(--accent-text)]" />
						<span className="text-lg font-semibold text-[var(--text)]">
							Recent Predictions
						</span>
					</div>
				}
				className="border border-[var(--border)] rounded-xl [background:var(--card-gradient)] backdrop-blur-xl shadow-lg"
			>
				{!isLoadingPredictions && (
					<List
						dataSource={recentPredictions}
						renderItem={(prediction) => {
							const filename = prediction.file_name
							const dateObject = new Date(
								prediction.created_at
							)
							const timeAgo = formatDistanceToNow(dateObject, {
								addSuffix: true,
							})
							const exactTime = format(
								dateObject,
								'HH:mm:ss, dd/MM/yyyy'
							)

							return (
								<List.Item
									className="border-b border-[var(--border)]"
									actions={[
										<Button
											type="primary"
											className="!bg-[#0ea5e9] hover:!bg-[#0284c7] !border-0"
											onClick={() =>
												onViewPrediction(prediction)
											}
										>
											View
										</Button>,
									]}
								>
									<List.Item.Meta
										avatar={
											<CheckCircleOutlined className="text-[var(--accent-text)]" />
										}
										title={
											<span className="text-[var(--text)]">
												{`File: ${filename}`}
											</span>
										}
										description={
											<Tooltip
												title={`Exact time: ${exactTime}`}
											>
												<span className="cursor-help text-[var(--secondary-text)]">
													{`Predicted ${timeAgo}`}
												</span>
											</Tooltip>
										}
									/>
								</List.Item>
							)
						}}
					/>
				)}
			</Card>
		</div>
	)
}

