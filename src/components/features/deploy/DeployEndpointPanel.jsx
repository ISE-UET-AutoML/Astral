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
						<LinkOutlined className="text-[var(--accent-text)]" />
						<span className="font-poppins text-lg font-semibold text-[var(--text)]">
							Endpoint Information
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
					API Endpoint URL
				</Divider>
				<div className="flex flex-col gap-4">
					{/* URL + Copy URL cùng hàng */}
					<div className="flex items-center gap-2 flex-nowrap">
						<Input
							className="flex-1 min-w-0 [&.ant-input]:!bg-[var(--input-bg)] [&.ant-input]:!border-[var(--input-border)] [&.ant-input]:!text-[var(--input-color)]"
							value={
								deployData?.api_base_url ||
								'https://api.example.com/predict/model-123'
							}
							readOnly
						/>
						<Button
							type="primary"
							className="!bg-[#0ea5e9] hover:!bg-[#0284c7] !border-0 shrink-0"
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
								} catch (err) {
									console.error('Failed to copy', err)
								}
							}}
						>
							Copy URL
						</Button>
					</div>

					{/* Hai nút ở góc cuối (phải) */}
					<div className="flex justify-end items-center gap-3 flex-wrap">
						<Button
							type="primary"
							onClick={onOpenUpload}
							loading={uploading}
							icon={<CloudUploadOutlined />}
							size="large"
							className="!bg-[#0ea5e9] hover:!bg-[#0284c7] !border-0"
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
							className="!bg-[#0ea5e9] hover:!bg-[#0284c7] !border-0 disabled:!opacity-50"
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

