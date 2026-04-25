import React, { useState, useEffect, useRef } from 'react';
import * as modelAPI from 'src/features/models/api/model'
import { Button as UiButton } from 'src/components/ui/button'
import { Card as UiCard, CardContent as UiCardContent, CardHeader as UiCardHeader, CardTitle as UiCardTitle } from 'src/components/ui/card'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Progress as UiProgress } from 'src/components/ui/progress'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Separator as UiSeparator } from 'src/components/ui/separator'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { Empty as UiEmpty, EmptyDescription as UiEmptyDescription } from 'src/components/ui/empty'
import { toast } from 'sonner'
import { CircleQuestionMark as QuestionCircleOutlined, CircleCheck as CheckCircleOutlined, CircleX as CloseCircleOutlined, FileText as FileTextOutlined, Eye as EyeOutlined, Table as TableOutlined, CircleAlert as ExclamationCircleOutlined, Filter as FilterOutlined, ChevronDown as DownOutlined, Check as CheckOutlined, Upload as UploadOutlined } from 'lucide-react'
import Papa from 'papaparse'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const getToastContent = (value) => typeof value === 'object' && value?.content ? value.content : value
const message = { success: (value) => toast.success(getToastContent(value)), error: (value) => toast.error(getToastContent(value)), warning: (value) => toast.warning(getToastContent(value)), info: (value) => toast.info(getToastContent(value)), loading: (value) => toast.loading(getToastContent(value)) }
const Spin = ({ tip, children, className = '', ...props }) => (<div className={cx('inline-flex items-center gap-2', className)} {...props}><UiSpinner />{tip && <span>{tip}</span>}{children}</div>)
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Card = ({ title, children, className = '', style, ...props }) => (<UiCard className={className} style={style} {...props}>{title && <UiCardHeader><UiCardTitle>{title}</UiCardTitle></UiCardHeader>}<UiCardContent>{children}</UiCardContent></UiCard>)
Card.Meta = ({ title, description, avatar, className = '' }) => (<div className={cx('flex items-start gap-3', className)}>{avatar}<div>{title && <div className="font-medium">{title}</div>}{description && <div className="text-sm text-muted-foreground">{description}</div>}</div></div>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const Progress = ({ percent, value, className = '', ...props }) => <UiProgress value={percent ?? value ?? 0} className={className} {...props} />
const Tag = ({ color, children, className = '', ...props }) => <UiBadge className={className} {...props}>{children}</UiBadge>
const Badge = ({ count, children, className = '', ...props }) => children ? <span className={cx('relative inline-flex', className)} {...props}>{children}{count != null && <UiBadge className="absolute -right-2 -top-2">{count}</UiBadge>}</span> : <UiBadge className={className} {...props}>{count}</UiBadge>
const Divider = ({ className = '', ...props }) => <UiSeparator className={className} {...props} />
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const Empty = ({ description = 'No data', className = '', ...props }) => <UiEmpty className={className} {...props}><UiEmptyDescription>{description}</UiEmptyDescription></UiEmpty>
const Typography = { Title: ({ level = 3, children, className = '', ...props }) => { const Heading = `h${level}`; return <Heading className={cx('font-semibold', className)} {...props}>{children}</Heading> }, Text: ({ children, className = '', ...props }) => <span className={className} {...props}>{children}</span>, Paragraph: ({ children, className = '', ...props }) => <p className={className} {...props}>{children}</p> }
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Layout = ({ children, className = '', ...props }) => <div className={className} {...props}>{children}</div>
Layout.Content = ({ children, className = '', ...props }) => <main className={className} {...props}>{children}</main>
Layout.Header = ({ children, className = '', ...props }) => <header className={className} {...props}>{children}</header>
Layout.Sider = ({ children, className = '', ...props }) => <aside className={className} {...props}>{children}</aside>
const Statistic = ({ title, value, prefix, suffix, className = '', ...props }) => <div className={className} {...props}>{title && <div className="text-sm text-muted-foreground">{title}</div>}<div className="text-2xl font-semibold">{prefix}{value}{suffix}</div></div>
const Switch = ({ checked, onChange, className = '', ...props }) => <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} className={className} {...props} />
const getCellValue = (record, dataIndex) => Array.isArray(dataIndex) ? dataIndex.reduce((value, key) => value?.[key], record) : record?.[dataIndex]
const Table = ({ columns = [], dataSource = [], rowKey = 'id', rowSelection, onRow, className = '', ...props }) => <div className={cx('w-full overflow-x-auto', className)}><table className="w-full border-collapse text-sm" {...props}><thead><tr>{rowSelection && <th className="border-b p-2" />}{columns.map((column, index) => <th key={column.key || column.dataIndex || index} className="border-b p-2 text-left font-medium">{column.title}</th>)}</tr></thead><tbody>{dataSource.map((record, rowIndex) => { const key = typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey] ?? rowIndex; const rowProps = onRow?.(record, rowIndex) || {}; return <tr key={key} className="hover:bg-muted/50" {...rowProps}>{rowSelection && <td className="border-b p-2"><input type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'} checked={rowSelection.selectedRowKeys?.includes(key)} onChange={() => rowSelection.onChange?.([key], [record])} /></td>}{columns.map((column, colIndex) => { const value = getCellValue(record, column.dataIndex); return <td key={column.key || column.dataIndex || colIndex} className="border-b p-2">{column.render ? column.render(value, record, rowIndex) : value}</td> })}</tr> })}</tbody></table></div>
const Pagination = ({ current = 1, total = 0, pageSize = 10, onChange, className = '', ...props }) => { const pages = Math.max(1, Math.ceil(total / pageSize)); return <div className={cx('flex items-center gap-2', className)} {...props}><button type="button" disabled={current <= 1} onClick={() => onChange?.(current - 1, pageSize)}>Prev</button><span>{current} / {pages}</span><button type="button" disabled={current >= pages} onClick={() => onChange?.(current + 1, pageSize)}>Next</button></div> }
const Drawer = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }
const Select = ({ options, value, defaultValue, onChange, children, placeholder, className = '', ...props }) => <select value={value} defaultValue={defaultValue} onChange={(event) => onChange?.(event.target.value)} className={cx('h-9 rounded-lg border border-input bg-background px-3 text-sm', className)} {...props}>{placeholder && <option value="">{placeholder}</option>}{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{children}</select>
Select.Option = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>
const Dropdown = ({ overlay, menu, children }) => <span className="relative inline-flex">{children}</span>
const Menu = ({ children, className = '', ...props }) => <div className={className} {...props}>{children}</div>
Menu.Item = ({ children, onClick, className = '', ...props }) => <button type="button" className={cx('block w-full px-3 py-2 text-left text-sm hover:bg-muted', className)} onClick={onClick} {...props}>{children}</button>
const { Title, Text, Paragraph } = Typography
const { Content, Header } = Layout
const { Option } = Select


const TabularPredict = ({ predictResult, uploadedFiles, projectInfo, handleUploadFiles, s3_url }) => {
    const [csvData, setCsvData] = useState([]);
    const [predictionHistory, setPredictionHistory] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(-1); // -1 khi chưa có file
    const [currentPage, setCurrentPage] = useState(1);
    const [incorrectPredictions, setIncorrectPredictions] = useState([]);
    const [statistics, setStatistics] = useState({
        correct: 0,
        incorrect: 0,
        accuracy: 0,
        totalReviewed: 0,
    });
    const [loading, setLoading] = useState(false);
    const [infoDrawerVisible, setInfoDrawerVisible] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [confidenceFilter, setConfidenceFilter] = useState('all');
    const [uploading, setUploading] = useState(false);
    const [isSavingFeedback, setIsSavingFeedback] = useState(false);

    const fileInputRef = useRef(null);
    const pageSize = 9;

    // Parse CSV và cập nhật dữ liệu
    useEffect(() => {
        if (uploadedFiles?.length && uploadedFiles[0]?.name.endsWith('.csv')) {
            setLoading(true);
            const reader = new FileReader();
            reader.onload = () => {
                Papa.parse(reader.result, {
                    header: true,
                    skipEmptyLines: true,
                    complete: ({ data, meta }) => {
                        const importantColumns = [
                            projectInfo.target_column,
                            'Predicted Class',
                            'Confidence',
                            'Actions',
                        ];
                        const initialVisibleColumns = meta.fields.filter(
                            (field) => importantColumns.includes(field) || meta.fields.indexOf(field) < 3
                        );
                        const initialIncorrect = predictResult
                            .map((result, idx) => (result.confidence < 0.7 ? idx : null))
                            .filter((idx) => idx !== null);

                        // Cập nhật lịch sử
                        setPredictionHistory((prev) => {
                            const existingIndex = prev.findIndex(
                                (item) => item.fileName === uploadedFiles[0].name
                            );
                            const newHistoryItem = {
                                fileName: uploadedFiles[0].name,
                                predictions: predictResult,
                                data,
                                visibleColumns: initialVisibleColumns,
                                incorrectPredictions: initialIncorrect,
                            };

                            let newHistory;
                            if (existingIndex >= 0) {
                                // Cập nhật file hiện có
                                newHistory = [...prev];
                                newHistory[existingIndex] = newHistoryItem;
                            } else {
                                // Thêm file mới
                                newHistory = [...prev, newHistoryItem];
                            }

                            // Cập nhật currentFileIndex
                            setCurrentFileIndex(existingIndex >= 0 ? existingIndex : newHistory.length - 1);

                            return newHistory;
                        });

                        // Cập nhật trạng thái hiện tại
                        setCsvData(data);
                        setVisibleColumns(initialVisibleColumns);
                        setIncorrectPredictions(initialIncorrect);
                        setCurrentPage(1); // Reset trang
                        setConfidenceFilter('all'); // Reset bộ lọc
                        setLoading(false);
                    },
                });
            };
            reader.readAsText(uploadedFiles[0]);
        }
    }, [uploadedFiles, predictResult, projectInfo]);

    // Chuyển đổi giữa các file trong lịch sử
    const handleFileSelect = (index) => {
        if (index >= 0 && index < predictionHistory.length) {
            const selectedItem = predictionHistory[index];
            setCurrentFileIndex(index);
            setCsvData(selectedItem.data);
            setVisibleColumns(selectedItem.visibleColumns);
            setIncorrectPredictions(selectedItem.incorrectPredictions);
            setCurrentPage(1); // Reset trang
            setConfidenceFilter('all'); // Reset bộ lọc
            setLoading(false);
        }
    };

    // Cập nhật thống kê
    useEffect(() => {
        const incorrect = incorrectPredictions.length;
        const total = csvData.length;
        const reviewed = Math.min(currentPage * pageSize, total);

        setStatistics({
            correct: total - incorrect,
            incorrect,
            accuracy: total ? (((total - incorrect) / total) * 100).toFixed(1) : 0,
            totalReviewed: reviewed,
        });
    }, [incorrectPredictions, csvData, currentPage]);

    const handlePredictionToggle = (index) => {
        setIncorrectPredictions((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
        // Cập nhật predictionHistory
        setPredictionHistory((prev) => {
            const newHistory = [...prev];
            if (newHistory[currentFileIndex]) {
                newHistory[currentFileIndex].incorrectPredictions = incorrectPredictions.includes(index)
                    ? incorrectPredictions.filter((i) => i !== index)
                    : [...incorrectPredictions, index];
            }
            return newHistory;
        });
    };

    const showRowDetails = (record, index) => {
        setSelectedRowData({ record, index });
        setInfoDrawerVisible(true);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setUploading(true);
            handleUploadFiles(files).finally(() => {
                setUploading(false);
            });
        }
    };

    const handleColumnVisibilityToggle = (column) => {
        setVisibleColumns((prev) =>
            prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
        );
        // Cập nhật predictionHistory
        setPredictionHistory((prev) => {
            const newHistory = [...prev];
            if (newHistory[currentFileIndex]) {
                newHistory[currentFileIndex].visibleColumns = visibleColumns.includes(column)
                    ? visibleColumns.filter((col) => col !== column)
                    : [...visibleColumns, column];
            }
            return newHistory;
        });
    };

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

    const getFilteredData = () => {
        if (confidenceFilter === 'all') return csvData;
        return csvData.filter((_, index) => {
            const confidence = predictResult[index]?.confidence || 0;
            if (confidenceFilter === 'high') return confidence >= 0.8;
            if (confidenceFilter === 'medium') return confidence >= 0.5 && confidence < 0.8;
            if (confidenceFilter === 'low') return confidence < 0.5;
            return true;
        });
    };

    const getColumns = () => {
        if (!csvData.length) return [];
        const allColumns = Object.keys(csvData[0]);
        const targetColumn = projectInfo.target_column;

        const baseColumns = allColumns
            .filter((col) => visibleColumns.includes(col))
            .map((col) => ({
                title: col,
                dataIndex: col,
                key: col,
                render: (text) => (col === targetColumn ? <Tag color="blue">{text}</Tag> : <Text>{text}</Text>),
                ellipsis: true,
            }));

        return [
            ...baseColumns,
            {
                title: 'Predicted Class',
                key: 'predictedClass',
                width: 160,
                render: (_, __, index) => {
                    const globalIndex = index + (currentPage - 1) * pageSize;
                    const predicted = predictResult[globalIndex]?.class;
                    const isCorrect = !incorrectPredictions.includes(globalIndex);
                    return <Tag color={isCorrect ? 'green' : 'red'}>{predicted}</Tag>;
                },
            },
            {
                title: 'Confidence',
                key: 'confidence',
                width: 160,
                render: (_, __, index) => {
                    const globalIndex = index + (currentPage - 1) * pageSize;
                    const confidence = predictResult[globalIndex]?.confidence || 0;
                    const color = confidence >= 0.7 ? 'green' : confidence >= 0.5 ? 'orange' : 'red';
                    return (
                        <Progress
                            percent={Math.round(confidence * 100)}
                            size="small"
                            status={confidence >= 0.4 ? 'normal' : 'exception'}
                            strokeColor={color}
                        />
                    );
                },
            },
            {
                title: 'Actions',
                key: 'actions',
                fixed: 'right',
                width: 150,
                render: (_, record, index) => {
                    const globalIndex = index + (currentPage - 1) * pageSize;
                    return (
                        <Space>
                            <Tooltip title={incorrectPredictions.includes(globalIndex) ? 'Mark as correct' : 'Mark as incorrect'}>
                                <Button
                                    type={incorrectPredictions.includes(globalIndex) ? 'default' : 'primary'}
                                    size="small"
                                    icon={incorrectPredictions.includes(globalIndex) ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                    onClick={() => handlePredictionToggle(globalIndex)}
                                    danger={!incorrectPredictions.includes(globalIndex)}
                                >
                                    {incorrectPredictions.includes(globalIndex) ? 'Correct' : 'Incorrect'}
                                </Button>
                            </Tooltip>
                            <Tooltip title="View details">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => showRowDetails(record, globalIndex)}
                                />
                            </Tooltip>
                        </Space>
                    );
                },
            },
        ];
    };

    const columns = getColumns();
    const filteredData = getFilteredData();

    return (
        <Layout className="bg-white">
            <Header className="bg-white p-0 mb-4">
                <Card bordered={false} className="shadow-sm">
                    <div className="flex justify-between items-center">
                        <Space>
                            <Title level={4} className="!m-0">
                                <TableOutlined /> Prediction Review Dashboard
                            </Title>
                            <Dropdown
                                overlay={
                                    <Menu>
                                        {predictionHistory.map((item, index) => (
                                            <Menu.Item key={index} onClick={() => handleFileSelect(index)}>
                                                <FileTextOutlined /> {item.fileName}
                                                {index === currentFileIndex && <CheckOutlined className="ml-2" />}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <Tag color="blue" icon={<FileTextOutlined />} className="cursor-pointer">
                                    {predictionHistory[currentFileIndex]?.fileName || 'No file uploaded'} <DownOutlined />
                                </Tag>
                            </Dropdown>
                        </Space>
                        <Space>
                            <Tooltip title="Filter by confidence">
                                <Select
                                    value={confidenceFilter}
                                    className="w-[120px]"
                                    onChange={setConfidenceFilter}
                                    dropdownMatchSelectWidth={false}
                                >
                                    <Option value="all">All predictions</Option>
                                    <Option value="high">High confidence</Option>
                                    <Option value="medium">Medium confidence</Option>
                                    <Option value="low">Low confidence</Option>
                                </Select>
                            </Tooltip>
                            <Tooltip title="Configure visible columns">
                                <Button icon={<FilterOutlined />} onClick={() => setInfoDrawerVisible(true)}>
                                    Columns
                                </Button>
                            </Tooltip>
                            <Tooltip title="Update feedback status">
								<Button
									icon={<CheckOutlined />}
									onClick={handleUpdateFeedback}
									disabled={!csvData.length || isSavingFeedback}
									loading={isSavingFeedback}
								>
									Update feedback
								</Button>
                            </Tooltip>
                            <Tooltip title="Upload new file for prediction">
                                <Button icon={<UploadOutlined />} onClick={handleClick} loading={uploading} type="primary">
                                    Upload New File
                                </Button>
                            </Tooltip>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleChange}
                                className="hidden"
                                accept=".csv"
                            />
                        </Space>
                    </div>
                </Card>
            </Header>
            <Content>
                <Card size="small" className="mb-4 border-green-500 bg-green-50 border-dashed">
                    <Space size="large" className="flex justify-between items-center">
                        <Statistic title="Total Predictions" value={csvData.length} prefix={<QuestionCircleOutlined />} />
                        <Statistic
                            title="Correct Predictions"
                            value={statistics.correct}
                            prefix={<CheckCircleOutlined className="text-green-500" />}
                        />
                        <Statistic
                            title="Incorrect Predictions"
                            value={statistics.incorrect}
                            prefix={<CloseCircleOutlined className="text-red-500" />}
                        />
                        <Statistic title="Accuracy" value={statistics.accuracy} suffix="%" precision={1} />
                    </Space>
                </Card>
                {loading ? (
                    <Card>
                        <div className="flex items-center justify-center p-12">
                            <Spin size="large" tip="Loading prediction data..." />
                        </div>
                    </Card>
                ) : csvData.length > 0 ? (
                    <Card className="shadow-sm [&_.ant-card-body]:p-0">
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            rowKey={(_, index) => index}
                            pagination={{
                                pageSize,
                                current: currentPage,
                                onChange: setCurrentPage,
                                showSizeChanger: false,
                                showTotal: (total) => `${total} predictions`,
                            }}
                            size="small"
                            scroll={{ x: 'max-content' }}
                            rowClassName={(_, index) =>
                                incorrectPredictions.includes(index + (currentPage - 1) * pageSize) ? 'bg-red-50' : ''
                            }
                        />
                    </Card>
                ) : (
                    <Card>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No prediction data available">
                            <Button type="primary" onClick={handleClick} loading={uploading}>
                                Upload a file to start
                            </Button>
                        </Empty>
                    </Card>
                )}
            </Content>
            <Drawer
                title={selectedRowData ? 'Prediction Details' : 'Column Visibility'}
                placement="right"
                onClose={() => {
                    setInfoDrawerVisible(false);
                    setSelectedRowData(null);
                }}
                open={infoDrawerVisible}
                width={400}
            >
                {selectedRowData ? (
                    <div>
                        <div className="mb-2">
                            <Statistic
                                title="Confidence Score"
                                value={(predictResult[selectedRowData.index]?.confidence * 100).toFixed(1)}
                                suffix="%"
                            />
                        </div>
                        <Divider orientation="left" orientationMargin="0">
                            Data Fields
                        </Divider>
                        {Object.entries(selectedRowData.record).map(([key, value]) => (
                            <div key={key} className="mb-2">
                                <Text strong>{key}: </Text>
                                <Text>
                                    {key === projectInfo.target_column ? <Tag color="blue">{value}</Tag> : value}
                                </Text>
                            </div>
                        ))}
                        <Divider orientation="left" orientationMargin="0">
                            Prediction
                        </Divider>
                        <div className="mb-2">
                            <Text strong>Predicted {projectInfo.target_column}: </Text>
                            <Tag color="purple">{predictResult[selectedRowData.index]?.class}</Tag>
                        </div>
                        <div className="mt-4">
                            <Space>
                                <Button
                                    type={incorrectPredictions.includes(selectedRowData.index) ? 'default' : 'primary'}
                                    danger={!incorrectPredictions.includes(selectedRowData.index)}
                                    icon={
                                        incorrectPredictions.includes(selectedRowData.index) ? (
                                            <CheckCircleOutlined />
                                        ) : (
                                            <CloseCircleOutlined />
                                        )
                                    }
                                    onClick={() => handlePredictionToggle(selectedRowData.index)}
                                >
                                    Mark as {incorrectPredictions.includes(selectedRowData.index) ? 'Correct' : 'Incorrect'}
                                </Button>
                            </Space>
                        </div>
                    </div>
                ) : (
                    <div>
                        <Text>Select which columns to display in the table.</Text>
                        <Divider orientation="left">Available Columns</Divider>
                        {csvData.length > 0 &&
                            Object.keys(csvData[0]).map((column) => (
                                <div key={column} className="mb-2">
                                    <Switch
                                        checked={visibleColumns.includes(column)}
                                        onChange={() => handleColumnVisibilityToggle(column)}
                                        size="small"
                                        className="mr-2"
                                    />
                                    <Text
                                        strong={column === projectInfo.target_column}
                                        type={column === projectInfo.target_column ? 'success' : undefined}
                                    >
                                        {column}
                                    </Text>
                                    {column === projectInfo.target_column && (
                                        <Tag color="blue" className="ml-2">
                                            Target
                                        </Tag>
                                    )}
                                </div>
                            ))}
                        <Divider />
                        <Button type="primary" block onClick={() => setInfoDrawerVisible(false)}>
                            Apply Changes
                        </Button>
                    </div>
                )}
            </Drawer>
        </Layout>
    );
};

export default TabularPredict;