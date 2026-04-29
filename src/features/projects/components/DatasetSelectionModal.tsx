import React from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const getCellValue = (record, dataIndex) => Array.isArray(dataIndex) ? dataIndex.reduce((value, key) => value?.[key], record) : record?.[dataIndex]
const Table = ({ columns = [], dataSource = [], rowKey = 'id', rowSelection, onRow, className = '', ...props }) => <div className={cx('w-full overflow-x-auto', className)}><table className="w-full border-collapse text-sm" {...props}><thead><tr>{rowSelection && <th className="border-b p-2" />}{columns.map((column, index) => <th key={column.key || column.dataIndex || index} className="border-b p-2 text-left font-medium">{column.title}</th>)}</tr></thead><tbody>{dataSource.map((record, rowIndex) => { const key = typeof rowKey === 'function' ? rowKey(record) : record?.[rowKey] ?? rowIndex; const rowProps = onRow?.(record, rowIndex) || {}; return <tr key={key} className="hover:bg-muted/50" {...rowProps}>{rowSelection && <td className="border-b p-2"><input type={rowSelection.type === 'radio' ? 'radio' : 'checkbox'} checked={rowSelection.selectedRowKeys?.includes(key)} onChange={() => rowSelection.onChange?.([key], [record])} /></td>}{columns.map((column, colIndex) => { const value = getCellValue(record, column.dataIndex); return <td key={column.key || column.dataIndex || colIndex} className="border-b p-2">{column.render ? column.render(value, record, rowIndex) : value}</td> })}</tr> })}</tbody></table></div>
const Modal = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }

const DatasetSelectionModal = ({
    open,
    onCancel,
    onConfirm,
    datasets,
    selectedDataset,
    onSelectDataset
}) => {
    return (
        <>
            <style>{`
                .theme-dataset-modal .ant-modal-title {
                    color: var(--modal-title-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .theme-dataset-modal .ant-modal-close {
                    color: var(--modal-close-color) !important;
                }
                
                .theme-dataset-modal .ant-modal-close:hover {
                    color: var(--modal-close-hover) !important;
                }
                
                .theme-dataset-modal .ant-modal-footer {
                    background: var(--modal-header-bg) !important;
                    border-top: 1px solid var(--modal-header-border) !important;
                }
                
                .theme-dataset-modal .ant-alert {
                    background: var(--alert-info-bg) !important;
                    border: 1px solid var(--alert-info-border) !important;
                    color: var(--alert-color) !important;
                }
                
                .theme-dataset-modal .ant-alert-message {
                    color: var(--alert-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 500 !important;
                }
                
                .theme-dataset-modal .ant-alert-description {
                    color: var(--secondary-text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .theme-dataset-modal .ant-table {
                    background: transparent !important;
                }
                
                .theme-dataset-modal .ant-table-thead > tr > th {
                    background: var(--table-header-bg) !important;
                    border-bottom: 1px solid var(--table-header-border) !important;
                    color: var(--table-header-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 600 !important;
                }
                
                .theme-dataset-modal .ant-table-tbody > tr > td {
                    background: var(--table-cell-bg) !important;
                    border-bottom: 1px solid var(--table-cell-border) !important;
                    color: var(--table-cell-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .theme-dataset-modal .ant-table-tbody > tr:hover > td {
                    background: var(--table-row-hover) !important;
                }
                
                .theme-dataset-modal .ant-table-tbody > tr.ant-table-row-selected > td {
                    background: var(--table-row-selected) !important;
                }
                
                .theme-dataset-modal .ant-radio-wrapper {
                    color: var(--text) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .theme-dataset-modal .ant-radio-inner {
                    background: var(--radio-bg) !important;
                    border-color: var(--radio-border) !important;
                }
                
                .theme-dataset-modal .ant-radio-checked .ant-radio-inner {
                    background: var(--radio-checked-bg) !important;
                    border-color: var(--radio-checked-border) !important;
                }
                
                .theme-dataset-modal .ant-btn-primary {
                    background: var(--button-primary-bg) !important;
                    border: 1px solid var(--button-primary-border) !important;
                    color: var(--button-primary-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                    font-weight: 500 !important;
                }
                
                .theme-dataset-modal .ant-btn-primary:hover {
                    background: var(--button-primary-bg) !important;
                    border-color: var(--modal-close-hover) !important;
                    transform: translateY(-1px) !important;
                }
                
                .theme-dataset-modal .ant-btn-default {
                    background: var(--button-default-bg) !important;
                    border: 1px solid var(--button-default-border) !important;
                    color: var(--button-default-color) !important;
                    font-family: 'Poppins', sans-serif !important;
                }
                
                .theme-dataset-modal .ant-btn-default:hover {
                    background: var(--hover-bg) !important;
                    border-color: var(--border-hover) !important;
                    color: var(--text) !important;
                }
                
                .theme-dataset-modal .ant-btn-primary:disabled {
                    background: var(--input-disabled-bg) !important;
                    border-color: var(--border) !important;
                    color: var(--input-disabled-color) !important;
                }
            `}</style>
            <Modal
            open={open}
            onCancel={onCancel}
            title="Select Dataset"
            footer={[
                <Button key="back" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    disabled={!selectedDataset}
                    onClick={onConfirm}
                >
                    Use Selected Dataset
                </Button>,
            ]}
            width={800}
            className="theme-dataset-modal z-[1000]"
            classNames={{
                content: '[background:var(--modal-bg)] border border-[var(--modal-border)] rounded-2xl',
                header: 'bg-[var(--modal-header-bg)] border-b border-[var(--modal-header-border)]',
            }}
        >
                <Alert
                    message="Choose a Dataset"
                    description="Select the dataset you want to use for training your AI model. The dataset should match your chosen project type for best results."
                    type="info"
                    showIcon
                    className="mb-4"
                />

                <Table
                    dataSource={datasets}
                    rowKey={(record) => record.id}
                    columns={[
                        {
                            title: 'Title',
                            dataIndex: 'title',
                            key: 'title',
                        },
                        {
                            title: 'Service',
                            dataIndex: 'service',
                            key: 'service',
                        },
                        {
                            title: 'Bucket',
                            dataIndex: 'bucketName',
                            key: 'bucket',
                        },
                    ]}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: selectedDataset ? [selectedDataset] : [],
                        onChange: (selectedRowKey) => {
                            onSelectDataset(selectedRowKey[0])
                        },
                    }}
                    pagination={false}
                    scroll={{ y: 400 }}
                    className="dataset-table"
                />
            </Modal>
        </>
    )
}

export default DatasetSelectionModal