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
						<MonitorOutlined className="text-[var(--accent-text)]" />
						<span className="font-poppins text-lg font-semibold text-[var(--text)]">
							Monitoring
						</span>
					</div>
				}
				className="border border-[var(--border)] rounded-xl [background:var(--card-gradient)] shadow-lg"
				style={{
					backdropFilter: 'blur(10px)',
					fontFamily: 'Poppins, sans-serif',
				}}
			>
				<Divider
					orientation="left"
					orientationMargin={0}
					className="!my-4 font-poppins font-semibold !border-[var(--border)] [&_.ant-divider-inner-text]:!text-[var(--text)]"
				>
					Monitor Endpoint URL
				</Divider>
				{/* URL + Copy URL + System Monitoring + GPU Monitoring trên 1 dòng */}
				<div className="flex items-center gap-2 flex-wrap">
					<Input
						className="flex-1 min-w-[180px] [&.ant-input]:!bg-[var(--input-bg)] [&.ant-input]:!border-[var(--input-border)] [&.ant-input]:!text-[var(--input-color)]"
						value={
							deployData?.monitor_url ||
							'https://api.example.com'
						}
						readOnly
					/>
					<Button
						type="primary"
						className="deploy-btn-solid shrink-0"
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
								console.error('Failed to copy', err)
							}
						}}
					>
						Copy URL
					</Button>
					<Button
						type="primary"
						icon={<LineChartOutlined />}
						className="deploy-btn-solid shrink-0"
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
						icon={<CalculatorOutlined />}
						className="deploy-btn-solid shrink-0"
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

