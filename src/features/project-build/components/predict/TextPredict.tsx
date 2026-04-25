import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Progress as UiProgress } from 'src/components/ui/progress'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { Empty as UiEmpty, EmptyDescription as UiEmptyDescription } from 'src/components/ui/empty'
import { toast } from 'sonner'
import { ChevronLeft as LeftOutlined, ChevronRight as RightOutlined, CircleQuestionMark as QuestionCircleOutlined, CircleCheck as CheckCircleOutlined, CircleX as CloseCircleOutlined, FileText as FileTextOutlined, Lightbulb as BulbOutlined, EyeOff as EyeInvisibleOutlined, Eye as EyeOutlined, Check as CheckOutlined } from 'lucide-react'
import Papa from 'papaparse'
import * as experimentAPI from 'src/features/project-build/api/experiment'
import * as modelAPI from 'src/features/models/api/model'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const getToastContent = (value) => typeof value === 'object' && value?.content ? value.content : value
const message = { success: (value) => toast.success(getToastContent(value)), error: (value) => toast.error(getToastContent(value)), warning: (value) => toast.warning(getToastContent(value)), info: (value) => toast.info(getToastContent(value)), loading: (value) => toast.loading(getToastContent(value)) }
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const Progress = ({ percent, value, className = '', ...props }) => <UiProgress value={percent ?? value ?? 0} className={className} {...props} />
const Tag = ({ color, children, className = '', ...props }) => <UiBadge className={className} {...props}>{children}</UiBadge>
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const Empty = ({ description = 'No data', className = '', ...props }) => <UiEmpty className={className} {...props}><UiEmptyDescription>{description}</UiEmptyDescription></UiEmpty>
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Layout = ({ children, className = '', ...props }) => <div className={className} {...props}>{children}</div>
Layout.Content = ({ children, className = '', ...props }) => <main className={className} {...props}>{children}</main>
Layout.Header = ({ children, className = '', ...props }) => <header className={className} {...props}>{children}</header>
Layout.Sider = ({ children, className = '', ...props }) => <aside className={className} {...props}>{children}</aside>
const Statistic = ({ title, value, prefix, suffix, className = '', ...props }) => <div className={className} {...props}>{title && <div className="text-sm text-muted-foreground">{title}</div>}<div className="text-2xl font-semibold">{prefix}{value}{suffix}</div></div>
const getCellValue = (record, dataIndex) => Array.isArray(dataIndex) ? dataIndex.reduce((value, key) => value?.[key], record) : record?.[dataIndex]
const Table = ({ columns = [], dataSource = [], rowKey = 'id', rowSelection, onRow, className = '', ...props }) => <div className={cx('w-full overflow-x-auto', className)}><table className="w-full border-collapse text-sm" {...props}><thead><tr>{rowSelection && <th className="border-b p-2" />}{columns.map((column, index) => <th key={column.key || column.dataIndex || index} className="border-b p-2 text-left font-medium">{column.title}</th>)}</tr></thead><tbody>{dataSource.map((record, rowIndex) => { const key = typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey] ?? rowIndex; const rowProps = onRow?.(record, rowIndex) || {}; return <tr key={key} className="hover:bg-muted/50" {...rowProps}>{rowSelection && <td className="border-b p-2"><input type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'} checked={rowSelection.selectedRowKeys?.includes(key)} onChange={() => rowSelection.onChange?.([key], [record])} /></td>}{columns.map((column, colIndex) => { const value = getCellValue(record, column.dataIndex); return <td key={column.key || column.dataIndex || colIndex} className="border-b p-2">{column.render ? column.render(value, record, rowIndex) : value}</td> })}</tr> })}</tbody></table></div>

const { Title, Text, Paragraph } = Typography
const { Content } = Layout

const TextPredict = ({ predictResult, uploadedFiles, projectInfo, s3_url }) => {
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const experimentName = searchParams.get('experimentName')
	const [csvData, setCsvData] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [incorrectPredictions, setIncorrectPredictions] = useState([])
	const [statistics, setStatistics] = useState({
		correct: 0,
		incorrect: 0,
		accuracy: 0,
	})
	const [isSavingFeedback, setIsSavingFeedback] = useState(false)
	const [isExplaining, setIsExplaining] = useState(false)
	// const [currentExplanation, setCurrentExplanation] = useState(null)
	const [explanations, setExplanations] = useState({})
	const [isTableVisible, setIsTableVisible] = useState(false)
	const textPreviewRef = useRef(null)
	const [currentPage, setCurrentPage] = useState(1)
	const pageSize = 10
	// Parse CSV and initialize data
	useEffect(() => {
		if (uploadedFiles?.[0]?.name.endsWith('.csv')) {
			const reader = new FileReader()
			reader.onload = () => {
				Papa.parse(reader.result, {
					header: true,
					skipEmptyLines: true,
					complete: ({ data }) => {
						setCsvData(data)
						// Initialize incorrect predictions based on confidence
						const initialIncorrect = predictResult
							.map((result, idx) =>
								result.confidence < 0.5 ? idx : null
							)
							.filter((idx) => idx !== null)
						setIncorrectPredictions(initialIncorrect)
					},
				})
			}
			reader.readAsText(uploadedFiles[0])
		}
	}, [uploadedFiles, predictResult])

	// Update statistics when predictions change
	useEffect(() => {
		const incorrect = incorrectPredictions.length
		const total = csvData.length
		setStatistics({
			correct: total - incorrect,
			incorrect,
			accuracy: total
				? (((total - incorrect) / total) * 100).toFixed(1)
				: 0,
		})
	}, [incorrectPredictions, csvData])
	const handlePredictionToggle = (index) => {
		setIncorrectPredictions((prev) =>
			prev.includes(index)
				? prev.filter((i) => i !== index)
				: [...prev, index]
		)
	}

	const currentPrediction = predictResult[currentIndex] || {}
	const currentData = csvData[currentIndex] || {}

	const handleUpdateFeedback = async () => {
		if (!s3_url) {
			message.error('Unable to save feedback: S3 URL is missing.')
			return
		}

		const feedbackList = csvData.map((row, index) => ({
			index,
			data: row,
			prediction: predictResult[index],
			feedback: incorrectPredictions.includes(index) ? 'Incorrect' : 'Correct',
		}))

		try {
			setIsSavingFeedback(true)
			await modelAPI.feedbackUpdate(s3_url, feedbackList)
			message.success('Feedback updated successfully')
		} catch (error) {
			console.error('Error updating feedback:', error)
			message.error(error.response?.data?.error || 'Failed to update feedback')
		} finally {
			setIsSavingFeedback(false)
		}
	}

	const handleExplain = async () => {
		setIsExplaining(true)

		try {
			const formData = new FormData()
			formData.append('text', currentData.sentence || '')
			formData.append('task', projectInfo.type)

			const { data } = await experimentAPI.explainData(
				experimentName,
				formData
			)

			const explanation = data.explanation[currentPrediction.class]
			const highlightWords = explanation?.words || []

			// Update CSV data with highlighted words
			const updatedCsvData = [...csvData]
			updatedCsvData[currentIndex] = {
				...currentData,
				highlight: highlightWords,
			}
			setCsvData(updatedCsvData)
			// Lưu explanation vào state
			setExplanations((prev) => ({
				...prev,
				[currentIndex]: explanation,
			}))

			// setCurrentExplanation(explanation)
		} catch (error) {
			console.error('Explanation error:', error.message)
		} finally {
			setIsExplaining(false)
		}
	}

	const currentExplanation = explanations[currentIndex]

	const renderTextWithHighlights = (text, highlights = []) => {
		if (!text) return <Empty description="No text available" />

		const words = text.split(' ')
		return (
			<div className="text-lg">
				{words.map((word, index) => {
					const isHighlighted = highlights.includes(
						word.toLowerCase().replace(/[^a-z0-9]/gi, '')
					)
					return (
						<span
							key={index}
							className={`${isHighlighted ? 'bg-yellow-200 px-1 rounded' : ''} mr-1`}
						>
							{word}
						</span>
					)
				})}
			</div>
		)
	}

	const handleViewClick = (index) => {
		setCurrentIndex(index + (currentPage - 1) * pageSize)
		// Trượt mượt mà đến phần Text Preview
		textPreviewRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'nearest',
		})
	}

	// Generate table columns
	const columns = [
		{
			title: 'Index',
			dataIndex: 'index',
			key: 'index',
			width: 80,
			render: (_, __, index) => index + 1,
		},
		{
			title: 'Text',
			dataIndex: 'sentence',
			key: 'sentence',
			// width: 180,
			render: (text) => (
				<Tooltip title={text}>
					<div className="max-w-xl truncate">{text}</div>
				</Tooltip>
			),
		},
		{
			title: `Predicted ${projectInfo.target_column}`,
			dataIndex: 'index',
			key: 'predictedClass',
			render: (_, __, index) =>
				predictResult[index + (currentPage - 1) * pageSize]?.class,
		},
		{
			title: 'Confidence',
			dataIndex: 'index',
			key: 'confidence',
			width: 160,
			render: (_, record, index) => {
				// Tính index toàn cục
				const globalIndex = index + (currentPage - 1) * pageSize
				const confidence = predictResult[globalIndex]?.confidence || 0
				const color =
					confidence >= 0.7
						? 'green'
						: confidence >= 0.5
							? 'orange'
							: 'red'
				return (
					<Progress
						percent={Math.round(confidence * 100)}
						size="small"
						status={confidence >= 0.4 ? 'normal' : 'exception'}
						strokeColor={color}
					/>
				)
			},
		},
		{
			title: 'Status',
			dataIndex: 'index',
			key: 'status',
			width: 120,
			render: (_, __, index) => {
				const globalIndex = index + (currentPage - 1) * pageSize
				const isIncorrect = incorrectPredictions.includes(globalIndex)
				return (
					<Tag
						color={isIncorrect ? 'error' : 'success'}
						icon={
							isIncorrect ? (
								<CloseCircleOutlined />
							) : (
								<CheckCircleOutlined />
							)
						}
					>
						{isIncorrect ? 'Incorrect' : 'Correct'}
					</Tag>
				)
			},
		},
		{
			title: 'Actions',
			key: 'actions',
			width: 180,
			render: (_, __, index) => (
				<Space>
					<Button
						size="small"
						type="primary"
						ghost
						onClick={() => handleViewClick(index)}
					>
						View
					</Button>
					<Button
						size="small"
						danger={!incorrectPredictions.includes(index)}
						type={
							incorrectPredictions.includes(index)
								? 'primary'
								: 'default'
						}
						ghost
						onClick={() => handlePredictionToggle(index)}
					>
						{incorrectPredictions.includes(index)
							? 'Mark Correct'
							: 'Mark Incorrect'}
					</Button>
				</Space>
			),
		},
	]

	return (
		<Layout className="bg-white">
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
							value={csvData.length}
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
				<Space direction="vertical" size="large" className="w-full">
					{/* Navigation Controls */}
					<Space className="w-full justify-between">
						<Button
							type="primary"
							icon={<LeftOutlined />}
							disabled={currentIndex === 0}
							onClick={() => setCurrentIndex((prev) => prev - 1)}
						>
							Previous
						</Button>
						<Text
							strong
						>{`Row ${currentIndex + 1} of ${csvData.length}`}</Text>
						<Button
							type="primary"
							icon={<RightOutlined />}
							disabled={currentIndex === csvData.length - 1}
							onClick={() => setCurrentIndex((prev) => prev + 1)}
						>
							Next
						</Button>
					</Space>
				</Space>

				{/* Main Content */}
				<div className="mt-6">
					<div className="grid grid-cols-2 gap-6">
						<Card ref={textPreviewRef}>
							<div className="h-[400px] overflow-y-auto pr-2 break-words">
								{renderTextWithHighlights(
									currentData.sentence,
									currentData.highlight
								)}
							</div>
						</Card>
						{/* Prediction Details */}
						<Card>
							<Space direction="vertical" className="w-full">
								<div
									className="flex justify-between items-center"
								>
									<Title level={4} className="!m-0">
										Prediction Results
									</Title>
									<Button
										type="primary"
										onClick={() =>
											setIsTableVisible(!isTableVisible)
										}
										icon={
											isTableVisible ? (
												<EyeInvisibleOutlined />
											) : (
												<EyeOutlined />
											)
										}
									>
										{isTableVisible
											? 'Hide All Predictions'
											: 'Show All Predictions'}
									</Button>
								</div>
								<Alert
									message={
										<Space>
											<Text>
												{`Predicted ${projectInfo.target_column}:`}
											</Text>
											<Text strong>
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
											currentPrediction.confidence * 100
										)}
										strokeColor={
											currentPrediction.confidence > 0.7
												? '#52c41a' // green
												: currentPrediction.confidence >
													0.4
													? '#fa8c16' // orange
													: '#ff4d4f' // red
										}
										format={(percent) => `${percent}%`}
									/>
								</div>
								<div
									className="flex justify-between items-center"
								>
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
											handlePredictionToggle(currentIndex)
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
									{!currentExplanation && (
										<Tooltip title="Explain this prediction">
											<Button
												type="primary"
												icon={<BulbOutlined />}
												onClick={handleExplain}
												loading={isExplaining}
											>
												Explain
											</Button>
										</Tooltip>
									)}
								</div>
								{currentExplanation ? (
									<Space
										direction="vertical"
										size="large"
										className="w-full mt-10"
									>
										<Alert
											message="Key Words"
											description="Highlighted words had the most influence on this prediction."
											type="info"
											showIcon
										/>
										<div>
											<Title level={5}>
												Important Words
											</Title>
											<div className="flex flex-wrap gap-1">
												{currentExplanation.words?.map(
													(word, index) => (
														<Tag
															key={index}
															color="blue"
														>
															{word}
														</Tag>
													)
												)}
											</div>
										</div>
										{/* Highlighted Paragraph */}
										{currentExplanation.explanation && (
											<div>
												<Title level={5}>
													Explanation
												</Title>
												<Paragraph>
													{
														currentExplanation.explanation
													}
												</Paragraph>
											</div>
										)}
									</Space>
								) : (
									<Empty description="No explanation available" />
								)}
							</Space>
						</Card>
					</div>
				</div>

				{/* Table of all predictions */}
				{isTableVisible && (
					<Card
						title={
							<span>
								<FileTextOutlined /> All Predictions
							</span>
						}
						extra={
							<Button
								icon={<CheckOutlined />}
								onClick={handleUpdateFeedback}
								loading={isSavingFeedback}
								disabled={!csvData.length || isSavingFeedback}
							>
								Update Feedback
							</Button>
						}
						className="mt-4"
					>
						<Table
							dataSource={csvData}
							columns={columns}
							rowKey={(_, index) => index}
							pagination={{
								pageSize: 10,
								current: currentPage,
								onChange: (page) => setCurrentPage(page), // Cập nhật trang hiện tại
							}}
							rowClassName={(_, index) =>
								index + (currentPage - 1) * pageSize ===
									currentIndex
									? 'bg-blue-50'
									: ''
							}
							size="middle"
						/>
					</Card>
				)}
			</Content>
		</Layout>
	)
}

export default TextPredict