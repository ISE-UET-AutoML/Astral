// CreateDatasetForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
    FolderIcon,
    DocumentIcon,
    TrashIcon,
    QuestionMarkCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Select } from 'src/components/shared/ui/Select';
import { Alert, AlertDescription } from 'src/components/shared/ui/alert';
import { DATASET_TYPES } from 'src/constants/types';
import { organizeFiles, createChunks, extractCSVMetaData } from 'src/utils/file';
import { DATASET_TASK_MAPPING, TASK_TYPE_INFO } from 'src/constants/dataset_task_mapping';
import ToastMessage from 'src/components/shared/utilities/Toast';

/* ── Shared style helpers ─────────────────────────────────────────────── */
const inputStyle = {
    width: '100%',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--input-color)',
    fontFamily: 'Poppins, sans-serif',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
};

const primaryBtnStyle = {
    background: 'var(--button-primary-bg)',
    border: '1px solid var(--button-primary-border)',
    color: 'var(--button-primary-color)',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
};

const defaultBtnStyle = {
    background: 'var(--button-default-bg)',
    border: '1px solid var(--button-default-border)',
    color: 'var(--button-default-color)',
    fontFamily: 'Poppins, sans-serif',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
};

/* ── FormField helper ─────────────────────────────────────────────────── */
const FormField = ({ label, error, required, children, className }) => (
    <div className={`mb-4 ${className || ''}`}>
        <label
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--form-label-color)', fontFamily: 'Poppins, sans-serif' }}
        >
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
        </label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

/* ── Main component ───────────────────────────────────────────────────── */
export default function CreateDatasetForm({
    onNext,
    onCancel,
    initialValues,
    initialFiles = [],
    initialDetectedLabels = [],
    initialCsvMetadata = null,
}) {
    const [title, setTitle] = useState(initialValues?.title || '');
    const [description, setDescription] = useState(initialValues?.description || '');
    const [datasetType, setDatasetType] = useState(initialValues?.dataset_type || null);
    const [taskType, setTaskType] = useState(initialValues?.taskType || null);
    const [service, setService] = useState(initialValues?.service || 'AWS_S3');
    const [bucketName, setBucketName] = useState(initialValues?.bucket_name || 'user-private-dataset');
    const [remoteUrl, setRemoteUrl] = useState(initialValues?.url || '');
    const [files, setFiles] = useState(initialFiles);
    const [totalKbytes, setTotalKbytes] = useState(() => {
        const total = initialFiles.reduce((s, f) => s + (f.fileObject?.size || 0), 0);
        return total > 0 ? (total / 1024).toFixed(2) : '0.00';
    });
    const [detectedLabels, setDetectedLabels] = useState(initialDetectedLabels);
    const [csvMetadata, setCsvMetadata] = useState(initialCsvMetadata);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('file');
    const [instructionsOpen, setInstructionsOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const fileInputRef = useRef(null);
    const fileRefs = useRef(new Map());

    const showError = (msg) => setToast({ show: true, message: msg, type: 'error' });

    useEffect(() => {
        if (initialFiles.length) {
            setFiles(initialFiles);
            const total = initialFiles.reduce((s, f) => s + (f.fileObject?.size || 0), 0);
            setTotalKbytes(total > 0 ? (total / 1024).toFixed(2) : '0.00');
        }
        if (initialDetectedLabels.length) setDetectedLabels(initialDetectedLabels);
        if (initialCsvMetadata) setCsvMetadata(initialCsvMetadata);
    }, [initialFiles, initialDetectedLabels, initialCsvMetadata]);

    const validateFiles = (fileList, type) => {
        const allowedImageTypes = ['image/jpeg', 'image/png'];
        const allowedTextTypes = ['text/plain', 'text/csv', 'application/xml', 'text/xml'];
        const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/flac'];
        const allowedVideoTypes = ['video/mp4', 'video/x-m4v', 'video/webm', 'video/quicktime', 'video/avi'];
        const allowedTypes = {
            IMAGE: [...allowedImageTypes, ...allowedTextTypes],
            TEXT: allowedTextTypes,
            TABULAR: allowedTextTypes,
            MULTIMODAL: [...allowedImageTypes, ...allowedTextTypes],
            TIME_SERIES: [...allowedTextTypes],
            AUDIO: [...allowedAudioTypes, ...allowedTextTypes],
            VIDEO: [...allowedVideoTypes, ...allowedTextTypes],
        };
        return fileList.filter(f => f?.type && allowedTypes[type]?.includes(f.type));
    };

    const handleFileChange = async (event) => {
        const uploadedFiles = Array.from(event.target.files || []);
        const validatedFiles = validateFiles(uploadedFiles, datasetType);

        const hasImageFolder = validatedFiles.some(f =>
            f.webkitRelativePath && f.webkitRelativePath.includes('/images/')
        );
        const hasCSVFile = validatedFiles.some(f =>
            (f.webkitRelativePath || f.name || '').toLowerCase().endsWith('.csv')
        );

        if (datasetType === 'MULTIMODAL' && (!hasImageFolder || !hasCSVFile)) {
            showError('For MULTIMODAL datasets, upload a folder with images and a CSV file.');
            return;
        }

        const totalSize = validatedFiles.reduce((sum, f) => sum + (f.size || 0), 0);
        const totalSizeInKB = totalSize > 0 ? (totalSize / 1024).toFixed(2) : '0.00';

        const fileMetadata = validatedFiles.map(f => ({
            path: f.webkitRelativePath || f.name,
            fileObject: f,
        }));

        const fileMap = organizeFiles(fileMetadata);
        const labels = Array.from(fileMap.keys()).filter(l => l !== 'unlabeled');
        setDetectedLabels(labels);

        const csvFile = validatedFiles.find(f =>
            (f.webkitRelativePath || f.name || '').toLowerCase().endsWith('.csv')
        );
        if (csvFile) {
            try {
                const metadata = await extractCSVMetaData(csvFile);
                setCsvMetadata(metadata);
            } catch (err) {
                console.error('Failed to extract CSV metadata:', err);
                showError('Failed to analyze CSV file');
            }
        }

        setFiles(fileMetadata);
        setTotalKbytes(totalSizeInKB);
    };

    const handleDeleteFile = (filePath) => {
        const updatedFiles = files.filter(f => f.path !== filePath);
        setFiles(updatedFiles);
        setDetectedLabels([]);
        setCsvMetadata(null);
        const total = updatedFiles.reduce((s, f) => s + (f.fileObject?.size || 0), 0);
        setTotalKbytes(total > 0 ? (total / 1024).toFixed(2) : '0.00');
    };

    const handleReset = () => {
        if (fileInputRef.current) fileInputRef.current.value = null;
        setFiles([]);
        setTotalKbytes('0.00');
        setDetectedLabels([]);
        setCsvMetadata(null);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items?.length > 0) setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles?.length > 0) {
            if (fileInputRef.current) fileInputRef.current.files = droppedFiles;
            handleFileChange({ target: { files: droppedFiles } });
        }
    };

    const getAvailableTaskTypes = () => {
        if (!datasetType) return [];
        const availableTypes = DATASET_TASK_MAPPING[datasetType] || [];
        return availableTypes.map(typeKey => ({ key: typeKey, ...TASK_TYPE_INFO[typeKey] }));
    };

    const isFolderUpload = ['IMAGE', 'MULTIMODAL', 'AUDIO', 'VIDEO'].includes(datasetType);
    const fileInputProps = {
        ref: fileInputRef,
        type: 'file',
        multiple: true,
        style: { display: 'none' },
        onChange: handleFileChange,
    };
    if (isFolderUpload) {
        fileInputProps.webkitdirectory = '';
        fileInputProps.directory = '';
    } else if (datasetType) {
        const allowedExtensions = {
            TEXT: '.csv,.xlsx,.xls',
            TABULAR: '.csv,.xlsx,.xls',
            TIME_SERIES: '.csv,.xlsx,.xls',
            AUDIO: '.mp3,.wav,.ogg,.m4a,.flac,.csv,.xml',
            VIDEO: '.mp4,.m4v,.csv,.xml,.mov,.webm,.avi',
        };
        fileInputProps.accept = allowedExtensions[datasetType] || '';
    }

    const currentTaskInfo = TASK_TYPE_INFO[taskType];

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        if (!title.trim()) errors.title = 'Please enter a title';
        if (!datasetType) errors.dataset_type = 'Please select a type';
        if (!taskType) errors.taskType = 'Please select a task type';
        if (activeTab === 'url' && !remoteUrl.trim()) errors.url = 'Please enter a URL';
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        onNext({
            title,
            description,
            dataset_type: datasetType,
            taskType,
            service,
            bucket_name: bucketName,
            url: remoteUrl,
            files,
            totalKbytes,
            detectedLabels,
            csvMetadata,
            meta_data: { detectedLabels, csvMetadata },
        });
    };

    return (
        <>
            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />

            <form onSubmit={handleSubmit}>
                {/* Row 1: Title */}
                <FormField label="Title" required error={formErrors.title}>
                    <input
                        style={inputStyle}
                        placeholder="Enter dataset title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        onFocus={e => { e.target.style.borderColor = 'var(--input-focus-border)'; e.target.style.boxShadow = 'var(--input-shadow)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
                    />
                </FormField>

                {/* Row 2: Data Type + Task Type */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField label="Data Type" required error={formErrors.dataset_type} className="mb-0">
                        <Select
                            placeholder="Select dataset type"
                            value={datasetType}
                            options={Object.entries(DATASET_TYPES).map(([key, value]) => ({ value: key, label: value.type }))}
                            onChange={(value) => {
                                setDatasetType(value);
                                setTaskType(null);
                                setInstructionsOpen(false);
                                handleReset();
                            }}
                        />
                    </FormField>

                    <FormField label="Task Type" required error={formErrors.taskType} className="mb-0">
                        <Select
                            placeholder={!datasetType ? '-- Select Data Type first --' : 'Select task type'}
                            value={taskType}
                            allowClear
                            options={datasetType
                                ? getAvailableTaskTypes().map(task => ({
                                    value: task.key,
                                    label: `${task.displayName} (${task.description})`,
                                }))
                                : []
                            }
                            onChange={(value) => {
                                setTaskType(value);
                                setInstructionsOpen(false);
                            }}
                        />
                    </FormField>
                </div>

                {/* Task preparation instructions collapsible */}
                {taskType && currentTaskInfo?.preparingInstructions && (
                    <div
                        className="mb-4 rounded-md overflow-hidden"
                        style={{ border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.97)' }}
                    >
                        <button
                            type="button"
                            className="flex items-center gap-2 w-full px-4 py-3 text-sm text-left"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontFamily: 'Poppins, sans-serif' }}
                            onClick={() => setInstructionsOpen(o => !o)}
                        >
                            <QuestionMarkCircleIcon className="h-4 w-4 shrink-0" />
                            <span className="font-medium">
                                Task Preparation Instructions ({currentTaskInfo.displayName})
                            </span>
                            <span className="ml-auto">
                                {instructionsOpen
                                    ? <ChevronUpIcon className="h-4 w-4" />
                                    : <ChevronDownIcon className="h-4 w-4" />
                                }
                            </span>
                        </button>
                        {instructionsOpen && (
                            <div
                                className="px-4 pb-4 text-sm whitespace-pre-line"
                                style={{ color: '#374151', fontFamily: 'Poppins, sans-serif', borderTop: '1px solid #ddd' }}
                            >
                                {currentTaskInfo.preparingInstructions}
                            </div>
                        )}
                    </div>
                )}

                {/* Description */}
                <FormField label="Description">
                    <textarea
                        style={{ ...inputStyle, resize: 'vertical', minHeight: '64px' }}
                        rows={2}
                        maxLength={500}
                        placeholder="Enter description (optional)"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        onFocus={e => { e.target.style.borderColor = 'var(--input-focus-border)'; e.target.style.boxShadow = 'var(--input-shadow)'; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
                    />
                    <div className="text-right text-xs mt-1" style={{ color: 'var(--secondary-text)', fontFamily: 'Poppins, sans-serif' }}>
                        {description.length}/500
                    </div>
                </FormField>

                {/* Storage provider + Bucket */}
                <div className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-5">
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: 'var(--form-label-color)', fontFamily: 'Poppins, sans-serif' }}
                        >
                            Storage Provider
                        </label>
                        <div className="flex flex-col gap-2">
                            {['AWS_S3', 'GCP_STORAGE'].map(val => (
                                <label
                                    key={val}
                                    className="flex items-center gap-2 cursor-pointer text-sm"
                                    style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif' }}
                                >
                                    <input
                                        type="radio"
                                        name="storage-provider"
                                        value={val}
                                        checked={service === val}
                                        onChange={() => setService(val)}
                                        style={{ accentColor: 'var(--button-primary-bg)' }}
                                    />
                                    {val === 'AWS_S3' ? 'AWS S3' : 'Google Cloud Storage'}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-7">
                        <FormField label="Bucket Name" className="mb-0">
                            <Select
                                value={bucketName}
                                onChange={setBucketName}
                                options={[
                                    { value: 'user-private-dataset', label: 'user-private-dataset' },
                                    { value: 'bucket-2', label: 'bucket-2' },
                                ]}
                            />
                        </FormField>
                    </div>
                </div>

                {/* Tabs: File Upload / Remote URL */}
                <div className="mb-4">
                    <div
                        className="flex border-b"
                        style={{ borderColor: 'var(--divider-color)' }}
                    >
                        {['file', 'url'].map(tab => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className="px-4 py-2 text-sm font-medium transition-colors"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'Poppins, sans-serif',
                                    color: activeTab === tab ? 'var(--tabs-active-text)' : 'var(--tabs-text)',
                                    borderBottom: activeTab === tab ? '2px solid var(--tabs-ink-bar)' : '2px solid transparent',
                                    marginBottom: '-1px',
                                }}
                            >
                                {tab === 'file' ? 'File Upload' : 'Remote URL'}
                            </button>
                        ))}
                    </div>

                    <div className="pt-4">
                        {activeTab === 'file' && (
                            <>
                                <label
                                    htmlFor="file-upload-input"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '120px',
                                        border: isDragging
                                            ? '2px dashed var(--modal-close-hover)'
                                            : '2px dashed var(--upload-border)',
                                        background: isDragging ? 'var(--hover-bg)' : 'var(--upload-bg)',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        marginBottom: '16px',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--modal-close-hover)';
                                        e.currentTarget.style.background = 'var(--hover-bg)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'var(--upload-border)';
                                        e.currentTarget.style.background = 'var(--upload-bg)';
                                    }}
                                >
                                    <div className="text-center">
                                        {isFolderUpload
                                            ? <FolderIcon style={{ width: 48, height: 48, color: 'var(--upload-icon)', margin: '0 auto' }} />
                                            : <DocumentIcon style={{ width: 48, height: 48, color: 'var(--upload-icon)', margin: '0 auto' }} />
                                        }
                                        <p style={{ marginTop: '8px', color: 'var(--upload-text)', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                            {isFolderUpload
                                                ? 'Drag and drop a folder or click to upload'
                                                : 'Drag and drop files or click to upload'
                                            }
                                        </p>
                                    </div>
                                    <input id="file-upload-input" {...fileInputProps} />
                                </label>

                                <div style={{ color: 'var(--text)', fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}>
                                    <span className="font-medium">{files.length} Files</span>
                                    <span style={{ marginLeft: '8px', color: 'var(--secondary-text)' }}>({totalKbytes} kB)</span>
                                </div>

                                {files.length > 0 && (
                                    <div style={{
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        background: 'var(--upload-bg)',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        marginTop: '12px',
                                    }}>
                                        {files.map(file => (
                                            <div
                                                key={file.path}
                                                className="flex items-center"
                                                style={{
                                                    borderBottom: '1px solid var(--divider-color)',
                                                    padding: '8px 0',
                                                    color: 'var(--text)',
                                                }}
                                            >
                                                <DocumentIcon style={{ width: 16, height: 16, marginRight: '8px', color: 'var(--upload-icon)', flexShrink: 0 }} />
                                                <span className="flex-1 text-sm font-poppins truncate">{file.path}</span>
                                                <span style={{ marginLeft: '8px', color: 'var(--secondary-text)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                                                    ({(file.fileObject?.size / 1024 || 0).toFixed(2)} kB)
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteFile(file.path)}
                                                    className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text)' }}
                                                >
                                                    <TrashIcon style={{ width: 16, height: 16 }} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'url' && (
                            <FormField label="URL" required error={formErrors.url}>
                                <input
                                    style={inputStyle}
                                    placeholder="Enter remote URL"
                                    value={remoteUrl}
                                    onChange={e => setRemoteUrl(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = 'var(--input-focus-border)'; e.target.style.boxShadow = 'var(--input-shadow)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </FormField>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" style={primaryBtnStyle}>
                        Next
                    </button>
                    <button type="button" onClick={onCancel} style={defaultBtnStyle}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
