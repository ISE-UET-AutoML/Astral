import React, { useState, useEffect } from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Input as UiInput } from 'src/components/ui/input'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { Empty as UiEmpty, EmptyDescription as UiEmptyDescription } from 'src/components/ui/empty'
import { FileImage as FileImageOutlined, Filter as FilterOutlined, RefreshCw as ReloadOutlined, Grid3x3 as AppstoreOutlined, Menu as BarsOutlined, Tags as TagsOutlined } from 'lucide-react'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Input = ({ className = '', ...props }) => <UiInput className={className} {...props} />
Input.TextArea = ({ className = '', ...props }) => <textarea className={cx('min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50', className)} {...props} />
const Tag = ({ color, children, className = '', ...props }) => <UiBadge className={className} {...props}>{children}</UiBadge>
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const Empty = ({ description = 'No data', className = '', ...props }) => <UiEmpty className={className} {...props}><UiEmptyDescription>{description}</UiEmptyDescription></UiEmpty>
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Row = ({ children, className = '', gutter, ...props }) => <div className={cx('flex flex-wrap', className)} {...props}>{children}</div>
const Col = ({ children, className = '', span, xs, sm, md, lg, ...props }) => <div className={cx('min-w-0 flex-1', className)} {...props}>{children}</div>
const Pagination = ({ current = 1, total = 0, pageSize = 10, onChange, className = '', ...props }) => { const pages = Math.max(1, Math.ceil(total / pageSize)); return <div className={cx('flex items-center gap-2', className)} {...props}><button type="button" disabled={current <= 1} onClick={() => onChange?.(current - 1, pageSize)}>Prev</button><span>{current} / {pages}</span><button type="button" disabled={current >= pages} onClick={() => onChange?.(current + 1, pageSize)}>Next</button></div> }
const Modal = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }
const Select = ({ options, value, defaultValue, onChange, children, placeholder, className = '', ...props }) => <select value={value} defaultValue={defaultValue} onChange={(event) => onChange?.(event.target.value)} className={cx('h-9 rounded-lg border border-input bg-background px-3 text-sm', className)} {...props}>{placeholder && <option value="">{placeholder}</option>}{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{children}</select>
Select.Option = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>
const Radio = ({ children, value, checked, onChange, className = '', ...props }) => <label className={cx('inline-flex items-center gap-2', className)}><input type="radio" value={value} checked={checked} onChange={(event) => onChange?.(event)} {...props} />{children}</label>
Radio.Group = ({ children, value, onChange, className = '', ...props }) => <div className={cx('inline-flex gap-2', className)} {...props}>{React.Children.map(children, (child) => React.isValidElement(child) ? React.cloneElement(child, { checked: child.props.value === value, onChange: () => onChange?.({ target: { value: child.props.value } }) }) : child)}</div>
Radio.Button = Radio

const { Title, Text } = Typography
const { Option } = Select
const { Search } = Input

const MultilabelImgClassDataView = ({ dataset, files }) => {
	const imagesPerPage = 16
	const [currentPage, setCurrentPage] = useState(1)
	const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
	const [selectedLabels, setSelectedLabels] = useState([])
	const [searchText, setSearchText] = useState('')
	const [filteredFiles, setFilteredFiles] = useState(files)
	const [availableLabels, setAvailableLabels] = useState([])
	const [labelCountFilter, setLabelCountFilter] = useState('all') // 'all', '2', '3', '4+'
	const [isModalVisible, setIsModalVisible] = useState(false) // Added modal state
	const [selectedImage, setSelectedImage] = useState(null) // Added selected image state

	// Extract all unique labels from files
	useEffect(() => {
		if (!files || files.length === 0) return

		const allLabels = new Set()
		files.forEach((file) => {
			const pathParts = file.fileName.split('/')
			// Extract all labels except the last part (id)
			const labels = pathParts.slice(0, pathParts.length - 1)
			labels.forEach((label) => allLabels.add(label))
		})

		setAvailableLabels(Array.from(allLabels))
	}, [files])

	// Filter files based on selected labels, search text, and label count
	useEffect(() => {
		if (!files) return

		let filtered = [...files]

		// Filter by selected labels
		if (selectedLabels.length > 0) {
			filtered = filtered.filter((file) => {
				const fileLabelPath = file.fileName.split('/')
				return selectedLabels.every((label) =>
					fileLabelPath.includes(label)
				)
			})
		}

		// Filter by search text
		if (searchText) {
			filtered = filtered.filter((file) =>
				file.fileName.toLowerCase().includes(searchText.toLowerCase())
			)
		}

		// Filter by number of labels
		if (labelCountFilter !== 'all') {
			filtered = filtered.filter((file) => {
				const labelCount = file.fileName.split('/').length - 1 // Subtract 1 for the ID part

				if (labelCountFilter === '2') {
					return labelCount === 2
				} else if (labelCountFilter === '3') {
					return labelCount === 3
				} else if (labelCountFilter === '4+') {
					return labelCount >= 4
				}
				return true
			})
		}

		setFilteredFiles(filtered)
		setCurrentPage(1) // Reset to first page when filters change
	}, [files, selectedLabels, searchText, labelCountFilter])

	// Calculate pagination
	const totalFiles = filteredFiles ? filteredFiles.length : 0
	const startIndex = (currentPage - 1) * imagesPerPage
	const endIndex = Math.min(startIndex + imagesPerPage, totalFiles)
	const currentFiles = filteredFiles
		? filteredFiles.slice(startIndex, endIndex)
		: []

	// Handle page change
	const handlePageChange = (page) => {
		setCurrentPage(page)
	}

	// Extract labels from file name
	const getLabelsFromFileName = (fileName) => {
		const parts = fileName.split('/')
		return parts.slice(0, parts.length - 1)
	}

	// Get ID from file name
	const getIdFromFileName = (fileName) => {
		const parts = fileName.split('/')
		return parts[parts.length - 1]
	}

	// Reset all filters
	const handleReset = () => {
		setSelectedLabels([])
		setSearchText('')
		setLabelCountFilter('all')
	}

	// Handle image click to show modal
	const handleImageClick = (file) => {
		setSelectedImage(file)
		setIsModalVisible(true)
	}

	// Handle modal close
	const handleModalClose = () => {
		setIsModalVisible(false)
		setSelectedImage(null)
	}

	// Render image card in grid view
	const renderGridItem = (file, index) => {
		const labels = getLabelsFromFileName(file.fileName)
		const id = getIdFromFileName(file.fileName)

		return (
			<Col
				xs={24}
				sm={12}
				md={8}
				lg={6}
				key={index}
				className="!mb-4"
			>
				<Card
					hoverable
					cover={
						<div
							className="h-[200px] overflow-hidden flex items-center"
							onClick={() => handleImageClick(file)} // Added click handler
						>
							{file.content ? (
								<img
									alt={`${id}`}
									src={file.content}
									className="max-h-full max-w-full object-contain"
								/>
							) : (
								<FileImageOutlined
									className="text-[64px] text-[#d9d9d9]"
								/>
							)}
						</div>
					}
				>
					<Card.Meta
						title={
							<div
								className="flex justify-between items-center"
							>
								<Text ellipsis className="max-w-[80%]">
									{id}
								</Text>
								<Tooltip title={`${labels.length} labels`}>
									<Tag color="purple">
										<TagsOutlined /> {labels.length}
									</Tag>
								</Tooltip>
							</div>
						}
						description={
							<Space
								direction="vertical"
								size={4}
								className="w-full"
							>
								<div
									className="max-h-[60px] overflow-hidden"
								>
									{labels.map((label, i) => (
										<Tag
											color="blue"
											key={i}
											className="m-0.5"
										>
											{label}
										</Tag>
									))}
								</div>
							</Space>
						}
					/>
				</Card>
			</Col>
		)
	}

	// Render image in list view
	const renderListItem = (file, index) => {
		const labels = getLabelsFromFileName(file.fileName)
		const id = getIdFromFileName(file.fileName)

		return (
			<div
				key={index}
				className="mb-4 p-4 rounded-lg border border-[#f0f0f0]"
			>
				<Row gutter={16} align="middle">
					<Col xs={24} sm={8} md={6} lg={4}>
						<div
							className="h-[100px] flex items-center justify-center"
							onClick={() => handleImageClick(file)} // Added click handler
						>
							{file.content ? (
								<img
									alt={`${id}`}
									src={file.content}
									className="max-h-full max-w-full object-contain"
								/>
							) : (
								<FileImageOutlined
									className="text-3xl text-[#d9d9d9]"
								/>
							)}
						</div>
					</Col>
					<Col xs={24} sm={16} md={18} lg={20}>
						<Space
							direction="vertical"
							size={8}
							className="w-full"
						>
							<div
								className="flex justify-between items-center"
							>
								<Text strong>{id}</Text>
								<Tooltip title={`${labels.length} labels`}>
									<Tag color="purple">
										<TagsOutlined /> {labels.length}
									</Tag>
								</Tooltip>
							</div>
							<div>
								{labels.map((label, i) => (
									<Tag
										color="blue"
										key={i}
										className="m-0.5"
									>
										{label}
									</Tag>
								))}
							</div>
						</Space>
					</Col>
				</Row>
			</div>
		)
	}

	console.log('Dataset:', dataset)

	return (
		<div className="!p-3">
			<Space direction="vertical" size={16} className="w-full">
				{/* Header */}
				<Row justify="space-between" align="middle">
					<Col>
						<Title level={2}>
							{dataset ? dataset.title : 'Multilabel Dataset'}
						</Title>
					</Col>
					<Col>
						<Space>
							{/* Reset button */}

							<Col>
								<Button
									icon={<ReloadOutlined />}
									onClick={handleReset}
								>
									Reset All Filters
								</Button>
							</Col>

							<Button
								icon={
									viewMode === 'grid' ? (
										<BarsOutlined />
									) : (
										<AppstoreOutlined />
									)
								}
								onClick={() =>
									setViewMode(
										viewMode === 'grid' ? 'list' : 'grid'
									)
								}
							>
								{viewMode === 'grid'
									? 'List View'
									: 'Grid View'}
							</Button>
						</Space>
					</Col>
				</Row>

				{/* Filter tools */}
				<Card>
					<Space
						direction="vertical"
						size={16}
						className="w-full"
					>
						{/* Label filter */}
						<Row gutter={[16, 16]} align="middle">
							<Col xs={24} sm={6} md={4} lg={3}>
								<Space>
									<FilterOutlined />
									<Text strong>Label Filters:</Text>
								</Space>
							</Col>
							<Col xs={24} sm={16} md={18} lg={19}>
								<Select
									mode="multiple"
									className="w-full"
									placeholder="Select labels to filter"
									value={selectedLabels}
									onChange={setSelectedLabels}
									allowClear
								>
									{availableLabels.map((label) => (
										<Option key={label} value={label}>
											{label}
										</Option>
									))}
								</Select>
							</Col>
						</Row>

						{/* Label count filter */}
						<Row gutter={[16, 16]} align="middle">
							<Col xs={24} sm={6} md={4} lg={3}>
								<Space>
									<TagsOutlined />
									<Text strong>Label Count:</Text>
								</Space>
							</Col>
							<Col xs={24} sm={16} md={18} lg={19}>
								<Radio.Group
									value={labelCountFilter}
									onChange={(e) =>
										setLabelCountFilter(e.target.value)
									}
									buttonStyle="solid"
								>
									<Radio.Button value="all">All</Radio.Button>
									<Radio.Button value="2">
										2 Labels
									</Radio.Button>
									<Radio.Button value="3">
										3 Labels
									</Radio.Button>
									<Radio.Button value="4+">
										4+ Labels
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>

						{/* Search */}
						<Row gutter={[16, 16]} align="middle">
							<Col xs={24} sm={6} md={4} lg={3}>
								<Space>
									<FilterOutlined />
									<Text strong>Search:</Text>
								</Space>
							</Col>
							<Col xs={24} sm={16} md={18} lg={19}>
								<Search
									placeholder="Search by filename"
									allowClear
									enterButton
									value={searchText}
									onChange={(e) =>
										setSearchText(e.target.value)
									}
								/>
							</Col>
						</Row>
					</Space>
				</Card>

				{/* Results count */}
				<div>
					<Text>
						Showing {startIndex + 1}-{endIndex} of {totalFiles}{' '}
						results
					</Text>
				</div>

				{/* Images display */}
				{currentFiles.length > 0 ? (
					viewMode === 'grid' ? (
						<Row gutter={[16, 16]}>
							{currentFiles.map((file, index) =>
								renderGridItem(file, index)
							)}
						</Row>
					) : (
						<div>
							{currentFiles.map((file, index) =>
								renderListItem(file, index)
							)}
						</div>
					)
				) : (
					<Empty description="No matching data found" />
				)}

				{/* Pagination */}
				{totalFiles > 0 && (
					<Row justify="center" className="!mt-4">
						<Pagination
							current={currentPage}
							total={totalFiles}
							pageSize={imagesPerPage}
							onChange={handlePageChange}
							showSizeChanger={false}
							showQuickJumper
						/>
					</Row>
				)}
			</Space>
			{/* Added Modal component */}
			<Modal
				visible={isModalVisible}
				onCancel={handleModalClose}
				footer={null}
				width={800}
				centered
				className="!p-0"
			>
				{selectedImage && (
					<img
						src={selectedImage.content}
						alt={getIdFromFileName(selectedImage.fileName)}
						className="w-full max-h-[80vh] object-contain"
					/>
				)}
			</Modal>
		</div>
	)
}

export default MultilabelImgClassDataView
