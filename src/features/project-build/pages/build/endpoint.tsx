import React, { useState, useRef } from 'react'
import { Button } from 'src/components/ui/button'
import { Separator as Divider } from 'src/components/ui/separator'
import { Input } from 'src/components/ui/input'
import { toast } from 'sonner'
import { Zap as ThunderboltOutlined, CircleCheck as CheckCircleOutlined, CloudUpload as CloudUploadOutlined, Link as LinkOutlined } from 'lucide-react'
import { validateFiles } from 'src/utils/file'
import * as experimentAPI from 'src/features/project-build/api/experiment'

const Endpoint = () => {
	// For uploading predict files
	const [uploading, setUploading] = useState(false)
	const fileInputRef = useRef(null)

	const handleUploadFiles = async (files) => {
		if (!instanceURL) {
			toast.error('No deployment instance URL available')
			return
		}

		const validFiles = validateFiles(files, projectInfo.type)

		console.log('uploadedFiles', validFiles)
		setUploadedFiles(validFiles)
		setUploading(true)
		addDeploymentLog('Uploading files for prediction', 'info')

		const formData = new FormData()
		formData.append('task', projectInfo.type)

		Array.from(validFiles).forEach((file) => {
			formData.append('files', file)
			addDeploymentLog(`Processing file: ${file.name}`, 'info')
		})
		console.log('Fetch prediction start')

		try {
			const { data } = await experimentAPI.predictData(
				experimentName,
				formData
			)
			console.log('Fetch prediction successful', data)
			if (data.status === 'failed') {
				toast.error(
					'Your Files are not valid. Please select files has the same structure with your training data',
					5
				)
				addDeploymentLog('No predictions found', data.message)
				setUploading(false)
				return
			}
			const { predictions } = data

			setPredictResult(predictions)
			setUploading(false)
			setCurrentStep(2)

			toast.success('Success Predict', 3)
			addDeploymentLog('Prediction completed successfully', 'success')
		} catch (error) {
			toast.error('Predict Fail', 3)
			addDeploymentLog(`Prediction failed: ${error.message}`, 'error')
			setUploading(false)
		}
	}

	const handleClick = () => {
		fileInputRef.current?.click()
	}

	const handleChange = (event) => {
		const files = event.target.files
		if (files && files.length > 0) {
			handleUploadFiles(files)
		}
	}

	return (
		<div className="min-h-screen bg-[#01000A] px-6 py-6">
			<div className="mx-auto max-w-5xl space-y-6">
				<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(15,32,39,0.8)] via-[rgba(32,58,67,0.6)] to-[rgba(44,83,100,0.8)] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
					<div className="mb-6 flex items-center gap-3">
						<LinkOutlined className="text-xl text-[#5C8DFF]" />
						<span className="text-lg font-semibold text-white">
							Endpoint Information
						</span>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<div className="space-y-1 rounded-xl bg-black/10 p-4">
							<div className="text-sm text-white/70">
								Endpoint Status
							</div>
							<div className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
								<CheckCircleOutlined />
								<span>Active</span>
							</div>
						</div>

						<div className="space-y-1 rounded-xl bg-black/10 p-4">
							<div className="text-sm text-white/70">
								Response Time
							</div>
							<div className="flex items-center gap-2 text-lg font-semibold text-sky-400">
								<ThunderboltOutlined />
								<span>75ms</span>
							</div>
						</div>

						<div className="space-y-1 rounded-xl bg-black/10 p-4">
							<div className="text-sm text-white/70">
								Success Rate
							</div>
							<div className="flex items-center gap-2 text-lg font-semibold text-amber-400">
								<CheckCircleOutlined />
								<span>99.9%</span>
							</div>
						</div>
					</div>

					<Divider orientation="left" className="border-white/10 text-white">
						API Endpoint URL
					</Divider>

					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex w-full items-center gap-3 md:w-2/3">
							<Input
								className="w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50"
								value={
									instanceURL ||
									'https://api.example.com/predict/model-123'
								}
								readOnly
							/>
							<Button
								type="primary"
								onClick={() => {
									navigator.clipboard
										.writeText(
											instanceURL ||
												'https://api.example.com/predict/model-123'
										)
										.then(() =>
											toast.success(
												'Copied to clipboard',
												1
											)
										)
										.catch(() =>
											toast.error(
												'Failed to copy',
												1
											)
										)
								}}
								className="rounded-xl border border-white/20 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 py-2 font-semibold text-white shadow-md hover:from-[#16213e] hover:to-[#0f3460]"
							>
								Copy URL
							</Button>
						</div>

						<div className="flex items-center gap-3">
							<input
								type="file"
								multiple
								ref={fileInputRef}
								onChange={handleChange}
								className="hidden"
								accept=".csv,.txt,.json,.xlsx,.png,.jpg"
							/>
							<Button
								type="primary"
								onClick={handleClick}
								loading={uploading}
								icon={<CloudUploadOutlined />}
								size="large"
								className="rounded-xl border border-white/20 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 py-2 font-semibold text-white shadow-md hover:from-[#16213e] hover:to-[#0f3460]"
							>
								{uploading
									? 'Predicting...'
									: 'Upload Files to Predict'}
							</Button>
						</div>
					</div>
				</div>

				{(() => {
					if (object) {
						const LiveInferComponent = object.liveInferView
						return (
							<LiveInferComponent
								projectInfo={projectInfo}
								handleUploadFiles={handleUploadFiles}
							/>
						)
					}
					return null
				})()}
			</div>
		</div>
	)
}
export default Endpoint
