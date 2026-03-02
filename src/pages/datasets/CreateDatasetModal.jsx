import React, { useState } from 'react';
import JSZip from 'jszip';
import { createChunks, organizeFiles, extractCSVMetaData } from 'src/utils/file';
import { uploadToS3 } from 'src/utils/s3';
import { IMG_NUM_IN_ZIP } from 'src/constants/file';
import * as datasetAPI from 'src/api/dataset';
import { SpinnerOverlay } from 'src/components/shared/ui/spinner';
import ToastMessage from 'src/components/shared/utilities/Toast';
import CreateDatasetForm from './CreateDatasetForm';
import CreateLabelProjectForm from './CreateLabelProjectForm';

const CreateDatasetModal = ({ visible, onCancel, onCreate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [datasetFormValues, setDatasetFormValues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [labelProjectData, setLabelProjectData] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const showError = (msg) => setToast({ show: true, message: msg, type: 'error' });

    const handleNext = async (values) => {
        setDatasetFormValues(values);
        setCurrentStep(1);
    };

    const handleBack = () => {
        setCurrentStep(0);
    };

    const isImageFolder = (files) => {
        const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        return files.every((file) => allowedImageExtensions.includes(file.path.split('.').pop().toLowerCase()));
    };
    const isAudioFolder = (files) => {
        const allowedAudioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac'];
        return files.every((file) => allowedAudioExtensions.includes(file.path.split('.').pop().toLowerCase()));
    };
    const isVideoFolder = (files) => {
        const allowedVideoExtensions = ['mp4', 'm4v', 'avi'];
        return files.every((file) => allowedVideoExtensions.includes(file.path.split('.').pop().toLowerCase()));
    };

    const handleSubmit = async (labelProjectValues) => {
        try {
            setIsLoading(true);
            console.log('handleSubmit called with labelProjectValues:', labelProjectValues);
            const { files, totalKbytes, dataset_type, service, bucket_name, title, description, taskType } = datasetFormValues;

            console.log('Initial dataset:', title);
            const initialDatasetPayload = { title, dataset_type };
            const initialResponse = await datasetAPI.initializeDataset(initialDatasetPayload);
            console.log('Initial dataset created:', initialResponse.data);
            const createdDataset = initialResponse.data;
            const datasetID = createdDataset.id;
            if (!datasetID) {
                throw new Error('Không thể khởi tạo dataset trên server.');
            }
            console.log('Dataset ID:', datasetID);

            setLabelProjectData(labelProjectValues);
            console.log('labelProjectData set to:', labelProjectValues);
            const fileMap = organizeFiles(files);
            const chunks = [];
            const zips = [];
            for (const [label, folderFiles] of fileMap.entries()) {
                if (isImageFolder(folderFiles)) {
                    const folderChunk = createChunks(new Map([[label, folderFiles]]), IMG_NUM_IN_ZIP);
                    chunks.push(...folderChunk);
                } else if (dataset_type === 'AUDIO' && isAudioFolder(folderFiles)) {
                    const folderChunk = createChunks(new Map([[label, folderFiles]]), IMG_NUM_IN_ZIP);
                    chunks.push(...folderChunk);
                } else if (dataset_type === 'VIDEO' && isVideoFolder(folderFiles)) {
                    const folderChunk = createChunks(new Map([[label, folderFiles]]), IMG_NUM_IN_ZIP);
                    chunks.push(...folderChunk);
                } else {
                    zips.push({ name: `chunk_unlabel_0.zip`, files: folderFiles });
                }
            }

            let extraMeta = {};
            const csvFile = files.find(f => f.path.endsWith('.csv'));
            if ((dataset_type === 'TEXT' || dataset_type === 'TABULAR' || dataset_type === 'MULTIMODAL' || dataset_type === 'TIME_SERIES') && csvFile) {
                try {
                    extraMeta = await extractCSVMetaData(csvFile.fileObject);
                } catch (err) {
                    console.warn('CSV meta extraction failed', err);
                }
            }

            const fileToChunkMap = new Map();
            chunks.forEach(chunk => {
                chunk.files.forEach(file => {
                    fileToChunkMap.set(file.path, chunk.name);
                });
            });

            const indexData = {
                dataset_title: title,
                dataset_type,
                files: files.map(file => {
                    const parts = file.path.split('/');
                    const simplePath = parts.length > 1 ? parts.slice(1).join('/') : file.path;
                    return {
                        path: `${datasetID}/${simplePath}`,
                        chunk: fileToChunkMap.get(file.path) || null,
                    };
                }),
                chunks: chunks.map(chunk => ({
                    name: chunk.name,
                    file_count: chunk.files.length,
                })),
            };

            const s3Files = [
                {
                    key: `${datasetID}/index.json`,
                    type: 'application/json',
                    content: JSON.stringify(indexData, null, 2),
                },
                ...chunks.map(chunk => ({
                    key: `${datasetID}/zip/${chunk.name}`,
                    type: 'application/zip',
                    files: chunk.files,
                })),
                ...zips.map(zip => ({
                    key: `${datasetID}/zip/${zip.name}`,
                    type: 'application/zip',
                    files: zip.files,
                })),
            ];

            const presignPayload = {
                dataset_title: datasetID,
                files: s3Files.map(file => ({ key: file.key, type: file.type })),
            };

            const { data: presignedUrls } = await datasetAPI.createPresignedUrls(presignPayload);
            for (const file of s3Files) {
                const url = presignedUrls.find(u => u.key === file.key)?.url;
                if (!url) throw new Error(`Missing presigned URL for ${file.key}`);

                if (file.type === 'application/json') {
                    await uploadToS3(url, new Blob([file.content], { type: 'application/json' }));
                } else {
                    const zip = new JSZip();
                    for (const f of file.files) {
                        let zipPath;
                        if (f.path.split('/').length === 2) {
                            const name = f.path.split('/').pop();
                            zipPath = `unlabel_${name}`;
                        } else {
                            zipPath = f.path.split('/').slice(-2).join('_');
                        }
                        zip.file(zipPath, f.fileObject);
                    }
                    const zipBlob = await zip.generateAsync({ type: 'blob' });
                    await uploadToS3(url, zipBlob);
                }
            }

            const finalizePayload = {
                service,
                bucket_name,
                total_files: files.length,
                total_size_kb: parseFloat(totalKbytes) || 0,
                index_path: `${datasetID}/index.json`,
                chunks: chunks.map(chunk => ({
                    name: chunk.name,
                    file_count: chunk.files.length,
                    s3_path: `${datasetID}/zip/${chunk.name}`,
                })),
                status: 'active',
                meta_data: extraMeta,
            };
            console.log('ID đang được dùng để finalize:', datasetID);
            await datasetAPI.finalizeDataset(datasetID, finalizePayload);
            console.log('Dataset finalized on server');
            onCreate(createdDataset, labelProjectValues);
            handleCancel();
        } catch (err) {
            console.error('Submit error:', err);
            showError('Failed to create dataset and label project');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setCurrentStep(0);
        setDatasetFormValues(null);
        setLabelProjectData(null);
        setIsLoading(false);
        onCancel();
    };

    if (!visible) return null;

    return (
        <>
            <ToastMessage
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCancel} />
                <div
                    className="relative z-50 w-full mx-4 flex flex-col max-w-[800px] max-h-[90vh] [background:var(--modal-bg)] border border-[var(--modal-border)] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.4)]"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-[var(--modal-header-bg)] border-b border-[var(--modal-header-border)] rounded-t-2xl">
                        <h2 className="m-0 text-lg font-semibold text-[var(--modal-title-color)] font-poppins">
                            Create New Dataset
                        </h2>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10 text-[var(--modal-close-color)] bg-transparent border-none cursor-pointer text-[18px]"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto p-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {isLoading ? (
                            <SpinnerOverlay text="Processing dataset, please wait..." />
                        ) : (
                            <>
                                {currentStep === 0 ? (
                                    <CreateDatasetForm
                                        onNext={handleNext}
                                        onCancel={handleCancel}
                                        initialValues={datasetFormValues}
                                        initialFiles={datasetFormValues?.files || []}
                                        initialDetectedLabels={datasetFormValues?.detectedLabels || []}
                                        initialCsvMetadata={datasetFormValues?.csvMetadata || null}
                                    />
                                ) : (
                                    <CreateLabelProjectForm
                                        onSubmit={handleSubmit}
                                        onBack={handleBack}
                                        onCancel={handleCancel}
                                        loading={isLoading}
                                        datasetType={datasetFormValues?.dataset_type}
                                        taskType={datasetFormValues?.taskType}
                                        description={datasetFormValues?.description}
                                        initialValues={{ name: datasetFormValues?.title }}
                                        detectedLabels={datasetFormValues?.detectedLabels || []}
                                        csvMetadata={datasetFormValues?.csvMetadata}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateDatasetModal;
