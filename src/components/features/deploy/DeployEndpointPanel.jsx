import React from 'react'
import { Card, Divider, Input, Button } from 'antd'
import { LinkOutlined, CloudUploadOutlined, ExportOutlined, StarOutlined } from '@ant-design/icons'
import UpDataDeploy from 'src/components/shared/utilities/UpDataDeploy'

export function DeployEndpointPanel({
	deployData,
	projectInfo,
	model,
	uploading,
	isShowUpload,
	isGeneratingUI,
	isCheckingUIStatus,
	isUIGenerated,
	onOpenUpload,
	onCloseUpload,
	onUploadComplete,
	onGenerateUI,
}) {
	if (!deployData || !projectInfo) return null

	return (
		<div className="mt-6">
			<Card
				title={
					<div className="flex items-center gap-2">
						<LinkOutlined className="text-[#1890ff]" />
						<span className="font-poppins text-[var(--secondary-text)]">
							Endpoint Information
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
					API Endpoint URL
				</Divider>
				<div className="flex flex-wrap items-center gap-3">
					<Input.Group compact>
						<Input
							className="w-full md:w-[30%]"
							value={
								deployData?.api_base_url ||
								'https://api.example.com/predict/model-123'
							}
							readOnly
						/>
						<Button
							type="primary"
							onClick={() => {
								const textToCopy =
									deployData?.api_base_url ||
									'https://api.example.com/predict/model-123'
								try {
									const textarea =
										document.createElement('textarea')
									textarea.value = textToCopy
									document.body.appendChild(textarea)
									textarea.select()
									document.execCommand('copy')
									document.body.removeChild(textarea)
									// message is global antd; rely on it being imported at page level if needed
								} catch (err) {
									// swallow, page can show its own message if needed
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
							onClick={onOpenUpload}
							loading={uploading}
							icon={<CloudUploadOutlined />}
							size="large"
						>
							{uploading ? 'Predicting...' : 'Upload Files to Predict'}
						</Button>
						<UpDataDeploy
							isOpen={isShowUpload}
							onClose={onCloseUpload}
							projectId={model?.id}
							taskType={projectInfo?.task_type}
							featureColumns={Object.keys(model?.metadata?.csv || {})}
							onUploadStart={null}
							onUploadComplete={onUploadComplete}
						/>

						<Button
							type="primary"
							onClick={
								isGeneratingUI || isCheckingUIStatus
									? undefined
									: onGenerateUI
							}
							disabled={isGeneratingUI || isCheckingUIStatus}
							loading={isGeneratingUI}
							size="large"
							icon={
								isUIGenerated ? <ExportOutlined /> : <StarOutlined />
							}
						>
							{isCheckingUIStatus ? (
								<span>Checking</span>
							) : isGeneratingUI ? (
								<span>Generating</span>
							) : isUIGenerated ? (
								<span>Your App is Ready</span>
							) : (
								<span>Generate UI</span>
							)}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	)
}

