import React, { useState, useEffect, useRef } from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Progress as UiProgress } from 'src/components/ui/progress'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { CircleCheck as CheckCircleOutlined, CircleX as CloseCircleOutlined, CircleQuestionMark as QuestionCircleOutlined, ChevronLeft as LeftOutlined, ChevronRight as RightOutlined, CirclePlay as PlayCircleOutlined, CirclePause as PauseCircleOutlined, Volume2 as SoundOutlined } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const Progress = ({ percent, value, className = '', ...props }) => <UiProgress value={percent ?? value ?? 0} className={className} {...props} />
const Badge = ({ count, children, className = '', ...props }) => children ? <span className={cx('relative inline-flex', className)} {...props}>{children}{count != null && <UiBadge className="absolute -right-2 -top-2">{count}</UiBadge>}</span> : <UiBadge className={className} {...props}>{count}</UiBadge>
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Layout = ({ children, className = '', ...props }) => <div className={className} {...props}>{children}</div>
Layout.Content = ({ children, className = '', ...props }) => <main className={className} {...props}>{children}</main>
Layout.Header = ({ children, className = '', ...props }) => <header className={className} {...props}>{children}</header>
Layout.Sider = ({ children, className = '', ...props }) => <aside className={className} {...props}>{children}</aside>
const Statistic = ({ title, value, prefix, suffix, className = '', ...props }) => <div className={className} {...props}>{title && <div className="text-sm text-muted-foreground">{title}</div>}<div className="text-2xl font-semibold">{prefix}{value}{suffix}</div></div>

const { Title, Text } = Typography
const { Content } = Layout

const AudioClassificationPredict = ({
	predictResult,
	uploadedFiles,
	projectInfo,
}) => {
	const audioRef = useRef(null)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [incorrectPredictions, setIncorrectPredictions] = useState([])
	const [statistics, setStatistics] = useState({
		correct: 0,
		incorrect: 0,
		accuracy: 0,
	})
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const handlePredictionToggle = (index) => {
		setIncorrectPredictions((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index]
		)
	}

	const currentPrediction = predictResult[currentIndex] || {}

	// Audio control handlers
	const handlePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause()
			} else {
				audioRef.current.play()
			}
			setIsPlaying(!isPlaying)
		}
	}

	const handleTimeUpdate = () => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime)
		}
	}

	const handleLoadedMetadata = () => {
		if (audioRef.current) {
			setDuration(audioRef.current.duration)
		}
	}

	const handleAudioEnded = () => {
		setIsPlaying(false)
		setCurrentTime(0)
	}

	const handleSeek = (value) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value
			setCurrentTime(value)
		}
	}

	const formatTime = (time) => {
		if (isNaN(time)) return '0:00'
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	// Update audio source when index changes
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.pause()
			audioRef.current.load()
			setIsPlaying(false)
			setCurrentTime(0)
		}
	}, [currentIndex])

	// Thumbnail gallery for audio files
	const renderThumbnails = () => (
		<Space className="w-full overflow-x-auto py-4" size="small">
			{uploadedFiles.map((data, index) => (
				<Badge
					key={index}
					count={
						incorrectPredictions.includes(index) ? (
							<CloseCircleOutlined className="text-red-500" />
						) : null
					}
				>
					<Tooltip title={data.name}>
						<Card
							size="small"
								className={`cursor-pointer w-[100px] ${currentIndex === index ? 'border-4 border-blue-500 bg-blue-50' : 'opacity-60'}`}
							onClick={() => setCurrentIndex(index)}
							hoverable
						>
							<div className="text-center">
								<SoundOutlined
									style={{
										fontSize: 32,
										color:
											currentIndex === index
												? '#1890ff'
												: '#8c8c8c',
									}}
								/>
								<Text
									ellipsis
									className="block text-[10px] mt-1"
								>
									{data.name}
								</Text>
							</div>
						</Card>
					</Tooltip>
				</Badge>
			))}
		</Space>
	)

	// Initialize incorrect predictions based on confidence
	useEffect(() => {
		const initialIncorrect = predictResult
			.map((result, idx) => (result.confidence < 0.5 ? idx : null))
			.filter((idx) => idx !== null)
		setIncorrectPredictions(initialIncorrect)
	}, [uploadedFiles, predictResult])

	// Update statistics when predictions change
	useEffect(() => {
		const incorrect = incorrectPredictions.length
		const total = uploadedFiles.length
		setStatistics({
			correct: total - incorrect,
			incorrect,
			accuracy: total
				? (((total - incorrect) / total) * 100).toFixed(1)
				: 0,
		})
	}, [incorrectPredictions, uploadedFiles])

	return (
		<Layout className=" bg-white">
			<Content className="p-4">
				{/* Header with Statistics */}
				<Card
					size="small"
					className="mb-4 border-green-500 bg-green-50 border-dashed"
				>
					<Space
						size="large"
						className="flex justify-between items-center"
					>
						<Statistic
							title="Total Predictions"
							value={uploadedFiles.length}
							prefix={<QuestionCircleOutlined />}
						/>
						<Statistic
							title="Correct Predictions"
							value={statistics.correct}
							prefix={
								<CheckCircleOutlined
									className="text-green-500"
								/>
							}
						/>
						<Statistic
							title="Incorrect Predictions"
							value={statistics.incorrect}
							prefix={
								<CloseCircleOutlined
									className="text-red-500"
								/>
							}
						/>
						<Statistic
							title="Accuracy"
							value={statistics.accuracy}
							suffix="%"
							precision={1}
						/>
					</Space>
				</Card>

				{/* Main Content */}
				<Card className="mb-6">
					<Space direction="vertical" size="large" className="w-full">
						{/* Navigation Controls */}
						<Space className="w-full justify-between">
							<Button
								type="primary"
								icon={<LeftOutlined />}
								disabled={currentIndex === 0}
								onClick={() =>
									setCurrentIndex((prev) => prev - 1)
								}
							>
								Previous
							</Button>
							<Text
								strong
							>{`Audio ${currentIndex + 1} of ${uploadedFiles.length}`}</Text>
							<Button
								type="primary"
								icon={<RightOutlined />}
								disabled={
									currentIndex === uploadedFiles.length - 1
								}
								onClick={() =>
									setCurrentIndex((prev) => prev + 1)
								}
							>
								Next
							</Button>
						</Space>

						{/* Main Content Area */}
						<div className="grid grid-cols-2 gap-6">
							{/* Audio Player */}
							<Card
								title={
									<Space>
										<SoundOutlined />
										<Text strong>Audio Player</Text>
									</Space>
								}
							>
								<Space
									direction="vertical"
									className="w-full"
									size="large"
								>
									{/* File Info */}
									<div>
										<Text type="secondary">File Name:</Text>
										<br />
										<Text strong>
											{uploadedFiles[currentIndex]?.name}
										</Text>
									</div>

									{/* Audio Element */}
									<audio
										ref={audioRef}
										onTimeUpdate={handleTimeUpdate}
										onLoadedMetadata={handleLoadedMetadata}
										onEnded={handleAudioEnded}
										className="hidden"
									>
										<source
											src={URL.createObjectURL(
												uploadedFiles[currentIndex]
											)}
											type={
												uploadedFiles[currentIndex]
													?.type
											}
										/>
										Your browser does not support the audio
										element.
									</audio>

									{/* Custom Audio Controls */}
									<div
										className="p-5 bg-[#f5f5f5] rounded-lg"
									>
										<Space
											direction="vertical"
											className="w-full"
											size="middle"
										>
											{/* Play/Pause Button */}
											<div
												className="text-center"
											>
												<Button
													type="primary"
													shape="circle"
													size="large"
													icon={
														isPlaying ? (
															<PauseCircleOutlined />
														) : (
															<PlayCircleOutlined />
														)
													}
													onClick={handlePlayPause}
													className="w-16 h-16 text-3xl"
												/>
											</div>

											{/* Progress Bar */}
											<div>
												<input
													type="range"
													min="0"
													max={duration || 0}
													value={currentTime}
													onChange={(e) =>
														handleSeek(
															parseFloat(
																e.target.value
															)
														)
													}
													className="w-full cursor-pointer"
												/>
												<div
													className="flex justify-between mt-[8px]"
												>
													<Text type="secondary">
														{formatTime(
															currentTime
														)}
													</Text>
													<Text type="secondary">
														{formatTime(duration)}
													</Text>
												</div>
											</div>
										</Space>
									</div>
								</Space>
							</Card>

							{/* Prediction Details */}
							<Card>
								<Space direction="vertical" className="w-full">
									<Title level={4}>Prediction Results</Title>
									<Alert
										message={
											<Space>
												<Text>
													{`Predicted Class:`}
												</Text>
												<Text
													strong
													className="uppercase"
												>
													{currentPrediction.class}
												</Text>
											</Space>
										}
										type={
											incorrectPredictions.includes(
												currentIndex
											)
												? 'error'
												: 'success'
										}
										showIcon
									/>
									<div>
										<Space className="w-full justify-between mb-2">
											<Text strong>Confidence Score</Text>
										</Space>
										<Progress
											percent={Math.round(
												currentPrediction.confidence *
													100
											)}
											strokeColor={
												currentPrediction.confidence >
												0.7
													? '#52c41a' // green
													: currentPrediction.confidence >
														  0.4
														? '#fa8c16' // orange
														: '#ff4d4f' // red
											}
											format={(percent) => `${percent}%`}
										/>
									</div>
									<div className="flex items-center">
										<Button
											type={
												incorrectPredictions.includes(
													currentIndex
												)
													? 'primary'
													: 'default'
											}
											danger={
												!incorrectPredictions.includes(
													currentIndex
												)
											}
											onClick={() =>
												handlePredictionToggle(
													currentIndex
												)
											}
											icon={
												incorrectPredictions.includes(
													currentIndex
												) ? (
													<CheckCircleOutlined />
												) : (
													<CloseCircleOutlined />
												)
											}
										>
											{incorrectPredictions.includes(
												currentIndex
											)
												? 'Mark as Correct'
												: 'Mark as Incorrect'}
										</Button>
									</div>
								</Space>
							</Card>
						</div>
						{/* Thumbnail Gallery */}
						{renderThumbnails()}
					</Space>
				</Card>
			</Content>
		</Layout>
	)
}

export default AudioClassificationPredict
