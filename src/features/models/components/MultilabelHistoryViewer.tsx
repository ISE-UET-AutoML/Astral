import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Input as UiInput } from 'src/components/ui/input'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Tooltip as UiTooltip, TooltipContent as UiTooltipContent, TooltipProvider as UiTooltipProvider, TooltipTrigger as UiTooltipTrigger } from 'src/components/ui/tooltip'
import { Empty as UiEmpty, EmptyDescription as UiEmptyDescription } from 'src/components/ui/empty'
import Papa from 'papaparse';
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Input = ({ className = '', ...props }) => <UiInput className={className} {...props} />
Input.TextArea = ({ className = '', ...props }) => <textarea className={cx('min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50', className)} {...props} />
const Tag = ({ color, children, className = '', ...props }) => <UiBadge className={className} {...props}>{children}</UiBadge>
const Tooltip = ({ title, children, ...props }) => (<UiTooltipProvider><UiTooltip><UiTooltipTrigger asChild>{children || <span />}</UiTooltipTrigger>{title && <UiTooltipContent {...props}>{title}</UiTooltipContent>}</UiTooltip></UiTooltipProvider>)
const Empty = ({ description = 'No data', className = '', ...props }) => <UiEmpty className={className} {...props}><UiEmptyDescription>{description}</UiEmptyDescription></UiEmpty>
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Switch = ({ checked, onChange, className = '', ...props }) => <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} className={className} {...props} />
const getCellValue = (record, dataIndex) => Array.isArray(dataIndex) ? dataIndex.reduce((value, key) => value?.[key], record) : record?.[dataIndex]
const Table = ({ columns = [], dataSource = [], rowKey = 'id', rowSelection, onRow, className = '', ...props }) => <div className={cx('w-full overflow-x-auto', className)}><table className="w-full border-collapse text-sm" {...props}><thead><tr>{rowSelection && <th className="border-b p-2" />}{columns.map((column, index) => <th key={column.key || column.dataIndex || index} className="border-b p-2 text-left font-medium">{column.title}</th>)}</tr></thead><tbody>{dataSource.map((record, rowIndex) => { const key = typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey] ?? rowIndex; const rowProps = onRow?.(record, rowIndex) || {}; return <tr key={key} className="hover:bg-muted/50" {...rowProps}>{rowSelection && <td className="border-b p-2"><input type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'} checked={rowSelection.selectedRowKeys?.includes(key)} onChange={() => rowSelection.onChange?.([key], [record])} /></td>}{columns.map((column, colIndex) => { const value = getCellValue(record, column.dataIndex); return <td key={column.key || column.dataIndex || colIndex} className="border-b p-2">{column.render ? column.render(value, record, rowIndex) : value}</td> })}</tr> })}</tbody></table></div>
const Drawer = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }


const MultilabelHistoryViewer = forwardRef(({ data }, ref) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [allColumns, setAllColumns] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [filterText, setFilterText] = useState('');

    const getPredictedLabels = (prediction) => {
        if (!prediction || !prediction.class || !prediction.label) {
            return [];
        }
        const binaryArray = prediction.class;
        const labels = prediction.label;
        return binaryArray
            .map((value, index) => (value === 1 ? labels[index] : null))
            .filter((label) => label !== null);
    };
    
    useImperativeHandle(ref, () => ({
        openDrawer() {
            setIsDrawerOpen(true);
        },
        downloadCsv() {
            downloadCsv();
        }
    }));

    const downloadCsv = () => {
        if (!data || data.length === 0) return;

        const dataToDownload = data.map(row => {
            const downloadRow = {};
            visibleColumns.forEach(col => {
                if (col === 'Predicted Class') {
                    downloadRow[col] = getPredictedLabels(row).join('; ');
                } else {
                    downloadRow[col] = row[col];
                }
            });
            return downloadRow;
        });

        const csv = Papa.unparse(dataToDownload);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `multilabel_prediction_history.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (data && data.length > 0 && typeof data[0] === 'object') {
            const keys = Object.keys(data[0]).filter(key => 
                key.toLowerCase() !== 'key' && 
                key.toLowerCase() !== 'class' && 
                key.toLowerCase() !== 'label'
            );
            // Thêm cột 'Predicted Class' ảo để quản lý
            setAllColumns([...keys, 'Predicted Class']);
            setVisibleColumns([...keys, 'Predicted Class']);
        } else {
            setAllColumns([]);
            setVisibleColumns([]);
        }
    }, [data]);

    const handleColumnToggle = (columnKey) => {
        setVisibleColumns((prev) =>
            prev.includes(columnKey)
                ? prev.filter((key) => key !== columnKey)
                : [...prev, columnKey]
        );
    };
    const truncateText = (text) => {
        if (typeof text !== 'string' || !text) return text;
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
    };

    const isTextTruncated = (text) => {
        return typeof text === 'string' && text.length > 50;
    };

    const tableColumns = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        const dataCols = allColumns
            .filter(key => key !== 'Predicted Class' && visibleColumns.includes(key))
            .map(key => ({
                title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                dataIndex: key,
                key: key,
                width: 180,
                render: (text) => {
                    const isTruncated = isTextTruncated(text);
                    
                    return (
                        <Tooltip title={isTruncated ? text : null}>
                            <span className={isTruncated ? 'cursor-help' : 'cursor-default'}>
                                {truncateText(text)}
                            </span>
                        </Tooltip>
                    );
                }
            }));

        const predictionCol = {
            title: 'Predicted Class',
            key: 'predictedClass',
            fixed: 'right',
            width: 200,
            render: (record) => { // 'record' là toàn bộ object của một dòng
                const predictedLabels = getPredictedLabels(record);
                if (predictedLabels.length === 0) {
                    return <Tag>No prediction</Tag>;
                }
                return (
                    <div className="flex flex-wrap gap-1">
                        {predictedLabels.map((label, idx) => (
                            <Tag key={idx} color="purple">
                                {label}
                            </Tag>
                        ))}
                    </div>
                );
            }
        };

        return visibleColumns.includes('Predicted Class') ? [...dataCols, predictionCol] : dataCols;

    }, [allColumns, visibleColumns, data]);

    const filteredDrawerColumns = allColumns.filter((col) =>
        col.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <>
            {data && data.length > 0 ? (
                <Table
                    columns={tableColumns}
                    dataSource={data}
                    rowKey={(record, index) => record.key ?? index}
                    scroll={{ x: 'max-content', y: 'calc(100vh - 250px)' }}
                    pagination={{ pageSize: 15 }}
                />
            ) : (
                <Empty description="No data to display" />
            )}
            <Drawer
                title="Column Settings"
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
            >
                <Input.Search
                    placeholder="Search column name"
                    onChange={(e) => setFilterText(e.target.value)}
                    className="!mb-4"
                />
                <Space direction="vertical" className="w-full">
                    {filteredDrawerColumns.map((columnKey) => (
                        <div key={columnKey} className="flex justify-between w-full p-2 rounded bg-gray-100 dark:bg-white/5">
                            <span className="font-medium">{columnKey}</span>
                            <Switch
                                checked={visibleColumns.includes(columnKey)}
                                onChange={() => handleColumnToggle(columnKey)}
                            />
                        </div>
                    ))}
                </Space>
            </Drawer>
        </>
    );
});

export default MultilabelHistoryViewer;