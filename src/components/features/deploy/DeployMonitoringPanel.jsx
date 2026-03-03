import React from 'react'
import { Card, Divider, Input, Button } from 'antd'
import { MonitorOutlined, LineChartOutlined, CalculatorOutlined } from '@ant-design/icons'

export function DeployMonitoringPanel({ deployData, projectInfo, taskConfig, onUploadFiles }) {
	if (!deployData || !projectInfo) return null

	return (
		<div className="mt-6">
			<Card
				title={
					<div className="flex items-center gap-2">
						<MonitorOutlined className="text-[#1890ff]" />
						<span className="font-poppins text-[var(--secondary-text)]">
							Monitoring
						</span>
					</div>
				}
				className="border border-[var(--border)] rounded-xl [background:var(--card-gradient)]"
				style={{
					backdropFilter: 'blur(10px)',
					fontFamily: 'Poppins, sans-serif',
				}}
			>
				<Divider
					orientation="left"
					orientationMargin={0}
					className="font-poppins text-[var(--secondary-text)]"
				>
					Monitor Endpoint URL
				</Divider>
				<div className="flex flex-wrap items-center gap-3">
					<Input.Group compact>
						<Input
							className="w-full md:w-[30%]"
							value={
								deployData?.monitor_url ||
								'https://api.example.com'
							}
							readOnly
						/>
						<Button
							type="primary"
							onClick={() => {
								const textToCopy =
									deployData?.monitor_url ||
									'https://api.example.com'
								try {
									const textarea =
										document.createElement('textarea')
									textarea.value = textToCopy
									document.body.appendChild(textarea)
									textarea.select()
									document.execCommand('copy')
									document.body.removeChild(textarea)
								} catch (err) {
									// eslint-disable-next-line no-console
									console.error('Failed to copy', err)
								}
							}}
						>
							Copy URL
						</Button>
					</Input.Group>
					<div className="flex flex-wrap items-center gap-3">
						<Button
							type="primary"
							size="large"
							icon={<LineChartOutlined />}
							disabled={!deployData?.monitor_url}
							onClick={() => {
								if (deployData?.monitor_url) {
									window.open(
										`${deployData.monitor_url}/d/rYdddlPWk/node-exporter-full`,
										'_blank',
										'noopener,noreferrer'
									)
								}
							}}
						>
							System Monitoring
						</Button>
						<Button
							type="primary"
							size="large"
							icon={<CalculatorOutlined />}
							disabled={!deployData?.monitor_url}
							onClick={() => {
								if (deployData?.monitor_url) {
									window.open(
										`${deployData.monitor_url}/d/vlvPlrgnk/gpu-metrics`,
										'_blank',
										'noopener,noreferrer'
									)
								}
							}}
						>
							GPU Monitoring
						</Button>
					</div>
				</div>
			</Card>

			{/* Live infer view */}
			{taskConfig?.liveInferView && (
				<>
					{(() => {
						const LiveInferComponent = taskConfig.liveInferView
						return (
							<LiveInferComponent
								projectInfo={projectInfo}
								handleUploadFiles={onUploadFiles}
							/>
						)
					})()}
				</>
			)}
		</div>
	)
}

