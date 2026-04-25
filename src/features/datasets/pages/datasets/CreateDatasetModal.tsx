import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { createChunks, organizeFiles, extractCSVMetaData } from 'src/utils/file';
import { uploadToS3 } from 'src/utils/s3';
import { IMG_NUM_IN_ZIP } from 'src/constants/file';
import * as datasetAPI from 'src/features/datasets/api/dataset';
import { Spinner } from 'src/components/ui/spinner';
import { toast } from 'sonner';
import CreateDatasetForm from './CreateDatasetForm';
import CreateLabelProjectForm from './CreateLabelProjectForm';

const CreateDatasetModal = ({ visible, onCancel, onCreate }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [datasetFormValues, setDatasetFormValues] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [canSubmitLabelForm, setCanSubmitLabelForm] = useState(false);
    const [labelProjectData, setLabelProjectData] = useState(null);
    const showError = (msg) => toast.error(msg);

    const handleNext = async (values) => {
        setDatasetFormValues(values);
        setCurrentStep(1);
    };

    const handleBack = () => {
        setCurrentStep(0);
        setCanSubmitLabelForm(false);
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
        setCanSubmitLabelForm(false);
        onCancel();
    };

    useEffect(() => {
        if (visible) {
            const scrollY = window.scrollY;
            const prevPosition = document.body.style.position;
            const prevTop = document.body.style.top;
            const prevWidth = document.body.style.width;
            const prevLeft = document.body.style.left;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.left = '0';
            return () => {
                document.body.style.position = prevPosition;
                document.body.style.top = prevTop;
                document.body.style.width = prevWidth;
                document.body.style.left = prevLeft;
                window.scrollTo(0, scrollY);
            };
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden overscroll-contain">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-hidden touch-none" onClick={handleCancel} aria-hidden="true" />
                <div
                    className={`relative z-[1001] w-full mx-4 sm:mx-6 lg:mx-8 flex flex-col max-h-[85dvh] sm:max-h-[90vh] [background:var(--modal-bg)] border border-[var(--modal-border)] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] ${datasetFormValues?.dataset_type === 'TABULAR' ? 'max-w-[95vw] sm:max-w-[640px] lg:max-w-[900px]' : 'max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px]'}`}
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

                    {/* Body - flex-1 min-h-0 để phần này scroll được */}
                    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-6" style={{ scrollbarWidth: 'thin' }}>
                        {isLoading ? (
                            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-[var(--secondary-text)]">
                                <Spinner />
                                <span>Processing dataset, please wait...</span>
                            </div>
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
                                        onValidityChange={setCanSubmitLabelForm}
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

                    {!isLoading && (
                        <div className="shrink-0 flex justify-end gap-2 sm:gap-3 px-6 py-4 border-t border-[var(--modal-header-border)] bg-[var(--modal-header-bg)] rounded-b-2xl">
                          
                            {currentStep === 0 ? (
                                <button
                                    type="submit"
                                    form="create-dataset-form-step0"
                                    className="px-4 sm:px-6 py-2 rounded-xl text-sm font-medium text-white border-none bg-gradient-to-r from-blue-700 to-blue-600 hover:-translate-y-[1px] transition-all shadow-sm"
                                >
                                    Next
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleBack();
                                        }}
                                        className="px-4 sm:px-6 py-2 rounded-xl text-sm font-medium bg-[var(--button-default-bg)] text-[var(--button-default-color)] border border-[var(--button-default-border)] hover:bg-[var(--hover-bg)] transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        form="create-label-project-form-step1"
                                        disabled={!canSubmitLabelForm}
                                        className={`px-6 sm:px-8 py-2 rounded-xl text-sm font-medium border border-blue-500 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-colors shadow-lg font-poppins ${!canSubmitLabelForm ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        Create
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateDatasetModal;
