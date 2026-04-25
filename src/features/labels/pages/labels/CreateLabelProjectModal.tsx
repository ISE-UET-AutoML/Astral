import React, { useState, useEffect } from 'react'
import { Button as UiButton } from 'src/components/ui/button'
import { Alert as UiAlert, AlertDescription as UiAlertDescription, AlertTitle as UiAlertTitle } from 'src/components/ui/alert'
import { Input as UiInput } from 'src/components/ui/input'
import { Badge as UiBadge } from 'src/components/ui/badge'
import { Separator as UiSeparator } from 'src/components/ui/separator'
import { Spinner as UiSpinner } from 'src/components/ui/spinner'
import { Plus as PlusOutlined } from 'lucide-react'
import { getDatasets } from 'src/features/datasets/api/dataset'
import { TASK_TYPES } from 'src/constants/types'
const cx = (...classes) => classes.filter(Boolean).join(' ')
const Button = ({ children, icon, loading, disabled, htmlType, type, className = '', ...props }) => (<UiButton type={htmlType || 'button'} disabled={disabled || loading} className={className} {...props}>{loading && <UiSpinner className="mr-2" />}{icon && <span className="inline-flex">{icon}</span>}{children}</UiButton>)
const Alert = ({ message, description, type, showIcon, className = '', ...props }) => (<UiAlert variant={type === 'error' ? 'destructive' : 'default'} className={className} {...props}>{message && <UiAlertTitle>{message}</UiAlertTitle>}{description && <UiAlertDescription>{description}</UiAlertDescription>}</UiAlert>)
const Input = ({ className = '', ...props }) => <UiInput className={className} {...props} />
Input.TextArea = ({ className = '', ...props }) => <textarea className={cx('min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50', className)} {...props} />
const Tag = ({ color, children, className = '', ...props }) => <UiBadge className={className} {...props}>{children}</UiBadge>
const Divider = ({ className = '', ...props }) => <UiSeparator className={className} {...props} />
const Space = ({ children, className = '', direction = 'horizontal', size = 8, ...props }) => <div className={cx('flex', direction === 'vertical' ? 'flex-col' : 'flex-row items-center', className)} style={{ gap: typeof size === 'number' ? size : undefined, ...props.style }} {...props}>{children}</div>
const Modal = ({ open, visible, onCancel, onClose, title, footer, children, width, className = '', centered, ...props }) => { const isOpen = open ?? visible; if (!isOpen) return null; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel || onClose}><div className={cx('max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl', className)} style={{ width: typeof width === 'number' ? width : width || undefined, ...props.style }} onClick={(event) => event.stopPropagation()}>{title && <div className="mb-4 text-lg font-semibold">{title}</div>}{children}{footer !== null && footer !== undefined && <div className="mt-4 flex justify-end gap-2">{footer}</div>}</div></div> }
const Select = ({ options, value, defaultValue, onChange, children, placeholder, className = '', ...props }) => <select value={value} defaultValue={defaultValue} onChange={(event) => onChange?.(event.target.value)} className={cx('h-9 rounded-lg border border-input bg-background px-3 text-sm', className)} {...props}>{placeholder && <option value="">{placeholder}</option>}{options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}{children}</select>
Select.Option = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>
const createFormApi = () => ({ values: {}, setFieldsValue(values) { this.values = { ...this.values, ...values } }, getFieldValue(name) { return this.values[name] }, async validateFields() { return this.values }, resetFields() { this.values = {} } })
const Form = ({ children, form, onFinish, className = '', ...props }) => <form className={className} onSubmit={(event) => { event.preventDefault(); onFinish?.(form?.values || {}) }} {...props}>{children}</form>
Form.Item = ({ children, label, className = '', ...props }) => <label className={cx('mb-3 block text-sm', className)}>{label && <div className="mb-1 font-medium">{label}</div>}{children}</label>
Form.useForm = () => React.useState(() => createFormApi())
Form.useWatch = (name, form) => form?.getFieldValue?.(name)
// import { snakeToCamel } from 'src/utils/mapper'

const { Option } = Select
const { TextArea } = Input

export default function CreateLabelProjectModal({ visible, onCancel, onCreate }) {
    const [form] = Form.useForm()
    const [datasets, setDatasets] = useState([])
    const [expectedLabels, setLabels] = useState([])
    const [newLabel, setNewLabel] = useState('')
    const [loading, setLoading] = useState(false)
    const [columnOptions, setColumnOptions] = useState([])

    const taskType = Form.useWatch('taskType', form)
    const selectedDatasetId = Form.useWatch('datasetId', form)

    useEffect(() => {
        form.setFieldsValue({ datasetId: undefined })
    }, [taskType, form])

    useEffect(() => {
        if (visible) {
            fetchDatasets()
            setLabels([])
            setNewLabel('')
            setColumnOptions([])
        }
    }, [visible])

    const fetchDatasets = async () => {
        try {
            const response = await getDatasets()
            console.log('API Response:', response)
            console.log('Response data:', response.data)
            console.log('Response data type:', typeof response.data)
            console.log('Is array:', Array.isArray(response.data))
            
            // Giữ nguyên key snake_case trong columns, chỉ chuẩn hoá unique_class_count -> uniqueClassCount khi cần
            const datasets = Array.isArray(response.data) ? response.data : (Array.isArray(response.data?.data) ? response.data.data : [])
            console.log('Final datasets:', datasets)
            setDatasets(datasets)
        } catch (error) {
            console.error('Error fetching datasets:', error)
            setDatasets([])
        }
    }

    useEffect(() => {
        const datasetsArray = Array.isArray(datasets) ? datasets : []
        const selectedDataset = datasetsArray.find(ds => ds.id === selectedDatasetId)
        setLabels([])
        setColumnOptions([])

        if (!selectedDataset) return

        if (selectedDataset.dataType === 'IMAGE' && selectedDataset.detectedLabels?.length > 0) {
            setLabels(selectedDataset.detectedLabels)
        }
        
        if (
            (selectedDataset.dataType === 'TEXT' || 
             selectedDataset.dataType === 'TABULAR' || 
             selectedDataset.dataType === 'MULTIMODAL') &&
            selectedDataset.metaData?.columns
        ) {
            console.log('Columns in dataset:', selectedDataset.metaData.columns)
            const columns = selectedDataset.metaData.columns
            const options = Object.entries(columns).map(([key, val]) => {
                const count = val.uniqueClassCount ?? val.unique_class_count ?? 0
                return {
                    value: key,
                    label: `${key} (${count} classes)`,
                    uniqueClassCount: count,
                }
            })
            setColumnOptions(options)
        }
    }, [selectedDatasetId, datasets])

    const handleAddLabel = () => {
        const v = newLabel.trim()
        if (v && !expectedLabels.includes(v)) {
            setLabels(prev => [...prev, v])
            setNewLabel('')
        }
    }

    const handleRemoveLabel = labelToRemove => {
        setLabels(prev => prev.filter(l => l !== labelToRemove))
    }

    const handleSubmit = async values => {
        setLoading(true)
        try {
            const selectedLabel = expectedLabels[0];
            const column = columnOptions.find(opt => opt.value === selectedLabel);
            const uniqueClassCount = column?.uniqueClassCount ?? 0;
            const is_binary_class = uniqueClassCount === 2;
            const payload = {
                ...values,
                expectedLabels,
                meta_data: {
                    is_binary_class
                }
            }

            console.log('payload', payload)
            await onCreate(payload)
            handleCancel()
        } catch (error) {
            console.error('Error creating project:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        form.resetFields()
        setLabels([])
        setNewLabel('')
        setColumnOptions([])
        onCancel()
    }

    const projectTypes = Object.entries(TASK_TYPES).map(([key, cfg]) => ({
        value: key,
        label: cfg.type
    }))

    return (
        <Modal
            title="Create New Label Project"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="name"
                    label="Project Name"
                    rules={[
                        { required: true, message: 'Please enter project name' },
                        { min: 3, message: 'Project name must be at least 3 characters' }
                    ]}
                >
                    <Input placeholder="Enter project name" />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <TextArea rows={3} maxLength={500} showCount />
                </Form.Item>

                <Form.Item
                    name="taskType"
                    label="Task Type"
                    rules={[{ required: true, message: 'Please select task type' }]}
                >
                    <Select placeholder="Select task type">
                        {projectTypes.map(pt => (
                            <Option key={pt.value} value={pt.value}>{pt.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.taskType !== curr.taskType}>
                    {({ getFieldValue }) => {
                        const selectedType = getFieldValue('taskType')
                        const requiredDataType = selectedType ? TASK_TYPES[selectedType]?.dataType : null
                        console.log('Datasets in filter:', datasets)
                        console.log('Datasets type:', typeof datasets)
                        console.log('Is datasets array:', Array.isArray(datasets))
                        const datasetsArray = Array.isArray(datasets) ? datasets : []
                        console.log('DatasetsArray:', datasetsArray)
                        const filtered = datasetsArray.filter(ds => ds.dataType === requiredDataType)

                        const getStatusColor = status => {
                            switch (status) {
                                case 'COMPLETED': return 'green'
                                case 'PROCESSING': return 'blue'
                                case 'FAILED': return 'red'
                                default: return 'default'
                            }
                        }

                        return (
                            <Form.Item
                                name="datasetId"
                                label="Dataset"
                                rules={[{ required: true, message: 'Please select a dataset' }]}
                            >
                                <Select
                                    placeholder={requiredDataType
                                        ? `Select a ${requiredDataType.toLowerCase()} dataset`
                                        : 'Please select project type first'}
                                    showSearch
                                    optionFilterProp="label"
                                    disabled={!requiredDataType}
                                >
                                    {filtered.map(ds => (
                                        <Option
                                            key={ds.id}
                                            value={ds.id}
                                            disabled={ds.processingStatus !== 'COMPLETED'}
                                            label={`${ds.title} (${ds.quantity} items)`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{ds.title} ({ds.quantity} items)</span>
                                                <Tag color={getStatusColor(ds.processingStatus)}>{ds.processingStatus}</Tag>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )
                    }}
                </Form.Item>

                {/* Expected Labels */}
                <Form.Item label="Expected Labels" required>
                    {columnOptions.length > 0 ? (
                        <Select
                            placeholder="Select label column"
                            value={expectedLabels[0] || undefined}
                            onChange={v => setLabels([v])}
                        >
                            {columnOptions.map(col => (
                                <Option key={col.value} value={col.value}>
                                    <div className="flex justify-between">
                                        <span>{col.value}</span>
                                        <i className="text-[0.8em] text-[#999]">
                                            {col.label.match(/\(([^)]+)\)/)?.[1]}
                                        </i>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter label name"
                                    value={newLabel}
                                    onChange={e => setNewLabel(e.target.value)}
                                    onPressEnter={handleAddLabel}
                                />
                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddLabel}
                                    disabled={!newLabel.trim()}
                                >
                                    Add
                                </Button>
                            </div>

                            {expectedLabels.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {expectedLabels.map(label => (
                                        <Tag
                                            key={label}
                                            closable
                                            onClose={() => handleRemoveLabel(label)}
                                            color="blue"
                                        >
                                            {label}
                                        </Tag>
                                    ))}
                                </div>
                            ) : (
                                <Alert
                                    message={
                                        <ul>
                                            <li>At least one expected label is required to create a project.</li>
                                        </ul>
                                    }
                                    type="info"
                                    showIcon
                                    className="text-sm mt-2"
                                />
                            )}
                        </>
                    )}
                </Form.Item>

                <Divider />

                <Form.Item className="mb-0">
                    <Space className="w-full justify-end">
                        <Button onClick={handleCancel}>Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            disabled={expectedLabels.length === 0}
                        >
                            Create Project
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    )
}
