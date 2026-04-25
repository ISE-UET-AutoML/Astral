import React, { useState, useEffect } from 'react'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import * as datasetAPI from 'src/features/datasets/api/dataset'
import * as projectAPI from 'src/features/projects/api/project'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { toast } from 'sonner'
import { Info as InfoCircleOutlined } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const getToastContent = (value) => typeof value === 'object' && value?.content ? value.content : value
const message = { success: (value) => toast.success(getToastContent(value)), error: (value) => toast.error(getToastContent(value)), warning: (value) => toast.warning(getToastContent(value)), info: (value) => toast.info(getToastContent(value)), loading: (value) => toast.loading(getToastContent(value)) }
const Spin = ({ tip, children, className = '', ...props }) => (<div className={cx('inline-flex items-center gap-2', className)} {...props}><UiSpinner />{tip && <span>{tip}</span>}{children}</div>)
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>
const Select = ({ options, value, defaultValue, onChange, children, placeholder, className = '', ...props }) => <select value={value} defaultValue={defaultValue} onChange={(event) => onChange?.(event.target.value)} className={cx('h-9 rounded-lg border border-input bg-background px-3 text-sm', className)} {...props}>{placeholder && <option value="">{placeholder}</option>}{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{children}</select>
Select.Option = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>

const { Option } = Select
const { Title, Text } = Typography

const SelectTargetCol = () => {
	const { projectInfo, selectedDataset, updateFields } = useOutletContext()
	const navigate = useNavigate()
	const [dataset, setDataset] = useState(null)
	const [colsName, setColsName] = useState([])
	const [selectedCol, setSelectedCol] = useState(null)
	const [loading, setLoading] = useState(false)
	const { id: projectID } = useParams()

	useEffect(() => {
		if (!selectedDataset?._id) return

		const fetchDataset = async () => {
			setLoading(true)
			try {
				const { data } = await datasetAPI.getDatasetPreview(
					selectedDataset._id,
					10
				)

				// Xử lý dữ liệu để đảm bảo cấu trúc nhất quán
				const processedData = data.files.map((row) => {
					// Chuyển đổi các giá trị undefined/null thành chuỗi rỗng
					return Object.entries(row).reduce((acc, [key, value]) => {
						acc[key] = value ?? ''
						return acc
					}, {})
				})

				setDataset(processedData)

				// Lấy tất cả các key có thể có từ tất cả các hàng
				const allKeys = [...new Set(processedData.flatMap(Object.keys))]
				setColsName(allKeys)
			} catch (error) {
				console.error('Error fetching dataset:', error)
				message.error('Failed to load dataset preview')
			} finally {
				setLoading(false)
			}
		}

		fetchDataset()
	}, [selectedDataset?._id])

	// Xác định loại dữ liệu của cột
	const getColumnType = (value) => {
		if (value === undefined || value === null || value === '')
			return 'unknown'
		if (typeof value === 'number') return 'number'
		if (!isNaN(Number(value))) return 'number'
		return 'text'
	}

	// Hàm gửi thông tin cột mục tiêu và cột văn bản
	const sendTargetColumn = async () => {
		if (!selectedCol) {
			message.warning('Please select a target column')
			return
		}

		// Các cột còn lại sẽ được xếp vào textCols
		const textCols = colsName.filter((col) => col !== selectedCol)

		setLoading(true)
		try {
			const formData = new FormData()
			formData.append('targetCol', selectedCol)
			formData.append('textCols', textCols)
			formData.append('datasetID', selectedDataset?._id)

			const res = await projectAPI.sendTargetColumn(projectID, formData)

			if (res.status === 200) {
				message.success('Target Column Set Successfully', 3)
				navigate(`/app/project/${projectInfo._id}/build/selectInstance`)
			}
		} catch (error) {
			console.error('Error sending target column:', error)
			message.error('Failed to set target column')
		} finally {
			setLoading(false)
		}
	}

	return (
	<>
		<style>{`
			.dark-build-page {
				background: #01000A;
				min-height: 100vh;
				padding: 24px;
			}
			
			.dark-build-card {
				background: linear-gradient(135deg, rgba(15, 32, 39, 0.8) 0%, rgba(32, 58, 67, 0.6) 50%, rgba(44, 83, 100, 0.8) 100%);
				backdrop-filter: blur(10px);
				border: 1px solid rgba(255, 255, 255, 0.1);
				border-radius: 16px;
				box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
			}
			
			.dark-build-title {
				background: linear-gradient(90deg, #5C8DFF 0%, #65FFA0 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
				font-family: 'Poppins', sans-serif;
				font-weight: 700;
			}
			
			.dark-build-text {
				color: rgba(255, 255, 255, 0.8);
				font-family: 'Poppins', sans-serif;
			}
			
			.dark-build-label {
				color: #5C8DFF;
				font-family: 'Poppins', sans-serif;
				font-weight: 600;
			}
			
			.dark-build-select .ant-select-selector {
				background: rgba(255, 255, 255, 0.1) !important;
				border: 1px solid rgba(255, 255, 255, 0.2) !important;
				color: white !important;
				border-radius: 12px !important;
			}
			
			.dark-build-select .ant-select-selector:hover {
				border-color: #5C8DFF !important;
				box-shadow: 0 0 0 2px rgba(92, 141, 255, 0.2) !important;
			}
			
			.dark-build-select .ant-select-selection-item {
				color: white !important;
			}
			
			.dark-build-select .ant-select-arrow {
				color: #5C8DFF !important;
			}
			
			.dark-build-button {
				background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%) !important;
				border: 1px solid rgba(255, 255, 255, 0.2) !important;
				border-radius: 12px !important;
				font-family: 'Poppins', sans-serif !important;
				font-weight: 600 !important;
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
			}
			
			.dark-build-button:hover {
				background: linear-gradient(135deg, #16213e 0%, #0f3460 100%) !important;
				box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
				transform: translateY(-2px) !important;
			}
			
			.dark-build-table {
				background: rgba(255, 255, 255, 0.05) !important;
				border: 1px solid rgba(255, 255, 255, 0.1) !important;
				border-radius: 12px !important;
			}
			
			.dark-build-table thead th {
				background: linear-gradient(135deg, rgba(92, 141, 255, 0.2) 0%, rgba(101, 255, 160, 0.2) 100%) !important;
				color: white !important;
				font-family: 'Poppins', sans-serif !important;
				font-weight: 600 !important;
				border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
			}
			
			.dark-build-table tbody td {
				color: rgba(255, 255, 255, 0.9) !important;
				font-family: 'Poppins', sans-serif !important;
				border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
			}
			
			.dark-build-table tbody tr:hover {
				background: rgba(92, 141, 255, 0.1) !important;
			}
			
			.dark-build-table tbody tr:hover td {
				background: transparent !important;
			}
			
			.dark-build-table .bg-blue-50 {
				background: rgba(92, 141, 255, 0.2) !important;
			}
			
			.dark-build-tooltip .ant-tooltip-inner {
				background: rgba(0, 0, 0, 0.9) !important;
				color: white !important;
				font-family: 'Poppins', sans-serif !important;
			}
		`}</style>
		<div className="dark-build-page">
			<Card className="dark-build-card mx-auto w-full border-none">
				<Title level={2} className="dark-build-title text-center mb-6">
					Select Target Column
				</Title>
				<Text className="dark-build-text block text-center mb-8">
					Choose the target column for analysis. The remaining columns
					will be used as text columns.
				</Text>

				<Spin spinning={loading}>
					<Row gutter={[24, 24]} className="mb-8">
						<Col xs={24} md={12} className="mx-auto">
							<div className="flex items-center mb-2">
								<label className="dark-build-label font-medium mr-3">
									Target Column{' '}
									<Tooltip title="Select the column that contains the target data for analysis." className="dark-build-tooltip">
										<InfoCircleOutlined className="text-gray-400" />
									</Tooltip>
								</label>
							</div>
							<Select
								className="dark-build-select w-full"
								placeholder="Select Target Column"
								value={selectedCol}
								onChange={setSelectedCol}
								optionFilterProp="children"
								showSearch
							>
								{colsName.map((col) => (
									<Option key={col} value={col}>
										{col}
									</Option>
								))}
							</Select>
						</Col>
					</Row>

					<div className="text-center">
						<Button
							type="primary"
							size="large"
							onClick={sendTargetColumn}
							disabled={!selectedCol}
							className="dark-build-button w-48"
						>
							Confirm Selection
						</Button>
					</div>

					{dataset && (
						<div className="mt-8 overflow-auto dark-build-table">
							<table className="w-full border-collapse text-sm">
								<thead className="sticky top-0 text-center">
									<tr>
										{colsName.map((col) => (
											<th key={col} className="pt-2 px-4">
												{col}
											</th>
										))}
									</tr>
									<tr>
										{colsName.map((col) => (
											<th
												key={col}
												className="pb-2 px-4 border-b text-xs text-gray-400"
											>
												{dataset[0]
													? getColumnType(
															dataset[0][col]
														)
													: 'unknown'}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{dataset.map((row, rowIndex) => (
										<tr
											key={rowIndex}
											className="border-b hover:bg-cyan-500/10 text-center transition-colors duration-200"
										>
											{colsName.map((col) => (
												<td
													key={col}
													className={`px-4 py-2 truncate max-w-[150px] ${col === selectedCol ? 'bg-cyan-500/20' : ''}`}
													title={row[col]}
												>
													{row[col]}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Spin>
			</Card>
		</div>
		</>
	)
}

export default SelectTargetCol
