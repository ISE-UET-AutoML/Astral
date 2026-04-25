import React, { useState, useEffect } from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Progress as UiProgress } from 'src/components/ui/progress'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { ChevronLeft as LeftOutlined, ChevronRight as RightOutlined, CircleQuestionMark as QuestionCircleOutlined, CircleCheck as CheckCircleOutlined, CircleX as CloseCircleOutlined } from 'lucide-react'
import Papa from 'papaparse'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const Progress = ({ percent, value, className = '', ...props }) => <UiProgress value={percent ?? value ?? 0} className={className} {...props} />
const Badge = ({ count, children, className = '', ...props }) => children ? <span className={cx('relative inline-flex', className)} {...props}>{children}{count != null && <UiBadge className="absolute -right-2 -top-2">{count}</UiBadge>}</span> : <UiBadge className={className} {...props}>{count}</UiBadge>
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Layout = ({ children, className = '', ...props }) => <div className={className} {...props}>{children}</div>
Layout.Content = ({ children, className = '', ...props }) => <main className={className} {...props}>{children}</main>
Layout.Header = ({ children, className = '', ...props }) => <header className={className} {...props}>{children}</header>
Layout.Sider = ({ children, className = '', ...props }) => <aside className={className} {...props}>{children}</aside>
const Statistic = ({ title, value, prefix, suffix, className = '', ...props }) => <div className={className} {...props}>{title && <div className="text-sm text-muted-foreground">{title}</div>}<div className="text-2xl font-semibold">{prefix}{value}{suffix}</div></div>
const Image = ({ preview, className = '', ...props }) => <img className={className} {...props} />
const getCellValue = (record, dataIndex) => Array.isArray(dataIndex) ? dataIndex.reduce((value, key) => value?.[key], record) : record?.[dataIndex]
const Table = ({ columns = [], dataSource = [], rowKey = 'id', rowSelection, onRow, className = '', ...props }) => <div className={cx('w-full overflow-x-auto', className)}><table className="w-full border-collapse text-sm" {...props}><thead><tr>{rowSelection && <th className="border-b p-2" />}{columns.map((column, index) => <th key={column.key || column.dataIndex || index} className="border-b p-2 text-left font-medium">{column.title}</th>)}</tr></thead><tbody>{dataSource.map((record, rowIndex) => { const key = typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey] ?? rowIndex; const rowProps = onRow?.(record, rowIndex) || {}; return <tr key={key} className="hover:bg-muted/50" {...rowProps}>{rowSelection && <td className="border-b p-2"><input type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'} checked={rowSelection.selectedRowKeys?.includes(key)} onChange={() => rowSelection.onChange?.([key], [record])} /></td>}{columns.map((column, colIndex) => { const value = getCellValue(record, column.dataIndex); return <td key={column.key || column.dataIndex || colIndex} className="border-b p-2">{column.render ? column.render(value, record, rowIndex) : value}</td> })}</tr> })}</tbody></table></div>

const { Title, Text } = Typography
const { Content } = Layout

const MultimodalPredict = ({ predictResult, uploadedFiles, projectInfo }) => {
	const [csvData, setCsvData] = useState([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [incorrectPredictions, setIncorrectPredictions] = useState([])
	const [statistics, setStatistics] = useState({
		correct: 0,
		incorrect: 0,
		accuracy: 0,
	})

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

	// Format data for the information table
	const getTableColumns = () => [
		{
			title: 'Field',
			dataIndex: 'field',
			key: 'field',
			width: '30%',
			render: (text) => (
				<Text strong>
					{text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}
				</Text>
			),
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value',
			render: (text) => <Text copyable>{text}</Text>,
		},
	]

	const getTableData = () => {
		return Object.entries(currentData).map(([key, value]) => ({
			key,
			field: key,
			value: value,
		}))
	}

	// Thumbnail gallery
	const renderThumbnails = () => (
		<Space className="w-full overflow-x-auto py-4" size="small">
			{csvData.map((data, index) => (
				<Badge
					key={index}
					count={
						incorrectPredictions.includes(index) ? (
							<CloseCircleOutlined className="text-red-500" />
						) : null
					}
				>
					<Image
						src={data[projectInfo.img_column]}
						alt={`Thumbnail ${index + 1}`}
						width={80}
						height={80}
						className={`object-cover cursor-pointer rounded-lg ${currentIndex === index ? 'border-4 border-blue-500' : 'opacity-60'}`}
						preview={false}
						onClick={() => setCurrentIndex(index)}
					/>
				</Badge>
			))}
		</Space>
	)

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
							>{`Image ${currentIndex + 1} of ${csvData.length}`}</Text>
							<Button
								type="primary"
								icon={<RightOutlined />}
								disabled={currentIndex === csvData.length - 1}
								onClick={() =>
									setCurrentIndex((prev) => prev + 1)
								}
							>
								Next
							</Button>
						</Space>

						{/* Main Content Area */}
						<div className="grid grid-cols-2 gap-6">
							{/* Image Display */}
							<Card>
								<Image
									src={currentData[projectInfo.img_column]}
									alt="Prediction Image"
									className="w-full object-contain"
								/>
							</Card>

							{/* Prediction Details */}
							<Card>
								<Space direction="vertical" className="w-full">
									<Title level={4}>Prediction Results</Title>

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

									<Table
										columns={getTableColumns()}
										dataSource={getTableData()}
										size="small"
										pagination={false}
										scroll={{ y: 300 }}
									/>
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

export default MultimodalPredict
