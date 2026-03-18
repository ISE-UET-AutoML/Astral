import {
    CircleStackIcon,
    StarIcon,
    TrashIcon,
    PhotoIcon,
    DocumentTextIcon,
    TableCellsIcon,
    Squares2X2Icon,
    ChartBarIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Progress, message } from 'antd'
import { DATASET_TYPES } from 'src/constants/types'

dayjs.extend(relativeTime)

const PROCESSING_STATUS = {
    COMPLETED: { text: 'Completed', badge: 'bg-green-100 text-green-800 dark:text-white border-green-200 dark:bg-green-400/60 dark:text-green-400 dark:border-green-700' },
    CREATING_DATASET: { text: 'Creating Dataset...', badge: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700' },
    PROCESSING: { text: 'Processing', badge: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700' },
    CREATING_LABEL_PROJECT: { text: 'Creating Label Project...', badge: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700' },
    FAILED: { text: 'Failed', badge: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700' },
}

const TYPE_ICON_MAP = {
    IMAGE: PhotoIcon,
    TEXT: DocumentTextIcon,
    TABULAR: TableCellsIcon,
    TEXT_CLASSIFICATION: DocumentTextIcon,
    MULTILABEL_TEXT_CLASSIFICATION: DocumentTextIcon,
    TABULAR_CLASSIFICATION: TableCellsIcon,
    TABULAR_REGRESSION: TableCellsIcon,
    MULTILABEL_TABULAR_CLASSIFICATION: TableCellsIcon,
    MULTIMODAL_CLASSIFICATION: Squares2X2Icon,
    MULTILABEL_IMAGE_CLASSIFICATION: PhotoIcon,
    OBJECT_DETECTION: PhotoIcon,
    SEMANTIC_SEGMENTATION: PhotoIcon,
    MULTIMODAL: Squares2X2Icon,
    TIME_SERIES: ChartBarIcon,
}

const resolveTypeFamily = (key) => {
    if (!key) return 'TEXT'
    if (key.includes('OBJECT') || key.includes('DETECTION')) return 'OBJECT_DETECTION'
    if (key.includes('SEGMENTATION')) return 'SEMANTIC_SEGMENTATION'
    if (key.includes('IMAGE')) return 'IMAGE'
    if (key.includes('MULTIMODAL') || key.includes('MULTI_MODAL')) return 'MULTIMODAL'
    if (key.includes('TIME') || key.includes('SERIES')) return 'TIME_SERIES'
    if (key.includes('TABULAR') || key.includes('TABLE')) return 'TABULAR'
    if (key.includes('TEXT') || key.includes('NLP')) return 'TEXT'
    return key
}

// Accent color per type family (for icon and progress bar)
const TYPE_ACCENT = {
    IMAGE: '#7C3AED', TEXT: '#6366F1', TABULAR: '#3B82F6',
    TIME_SERIES: '#38BDF8', MULTIMODAL: '#9333EA', OBJECT_DETECTION: '#A855F7',
    SEMANTIC_SEGMENTATION: '#6366F1',
}

export default function DatasetCard({ dataset, onDelete, isDeleting }) {
    const handleDelete = (e, datasetID) => {
        e.preventDefault()
        e.stopPropagation()
        if (window.confirm('Are you sure you want to delete this dataset?')) {
            onDelete(datasetID)
        }
    }

    const dataType = dataset.dataType || 'UNKNOWN'
    const processingStatus = dataset.processingStatus || 'PROCESSING'
    const totalFiles = dataset.metaData?.totalFiles || 0
    const totalSizeKb = dataset.metaData?.totalSizeKb || 0
    const createdAtDisplay = dataset?.createdAt ? dayjs(dataset.createdAt).format('MMM D, YYYY') : 'N/A'
    const thumbnail = dataset?.thumbnail
    const isCompleted = processingStatus === 'COMPLETED'
    const isProcessing = ['PROCESSING', 'CREATING_DATASET', 'CREATING_LABEL_PROJECT'].includes(processingStatus)
    const isFailed = processingStatus === 'FAILED'
    const statusConfig = PROCESSING_STATUS[processingStatus] || PROCESSING_STATUS.PROCESSING
    const lsProjectId = dataset.lsProject?.labelStudioId || null
    const lsProject = dataset.lsProject || {}
    const annotatedCount = lsProject.annotatedNums || 0
    const totalAnnotations = lsProject.annotationNums || dataset.quantity || 0
    const progress = totalAnnotations > 0 ? Math.round((annotatedCount / totalAnnotations) * 100) : 0

    const normalizedKey = (dataType || '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/_+/, '_').replace(/^_|_$/, '')
    const familyKey = resolveTypeFamily(normalizedKey)
    const TypeIcon = TYPE_ICON_MAP[familyKey] || TYPE_ICON_MAP[normalizedKey] || CircleStackIcon
    const accentColor = TYPE_ACCENT[familyKey] || '#3B82F6'

    const handleCardClick = () => {
        if (isCompleted && lsProjectId) {
            window.open(`${process.env.REACT_APP_LABEL_STUDIO_URL}/projects/${lsProjectId}`, '_blank')
        } else if (!isCompleted) {
            message.info('Dataset is still processing. Please wait for completion.')
        } else {
            message.error('Label Studio ID is missing for this project.')
        }
    }

    const borderClass = isCompleted
        ? 'border-2 border-green-500/60 shadow-green-500/10'
        : isFailed
            ? 'border-2 border-red-500/60 shadow-red-500/10'
            : 'border-2 border-blue-500/40 shadow-blue-500/10'

    return (
        <div
            key={dataset.id}
            className={`group rounded-2xl shadow-lg w-full min-h-[360px] overflow-hidden font-poppins transition-all duration-300 flex flex-col relative ${isProcessing ? 'bg-blue-50/80 dark:bg-blue-900/30' : 'bg-white dark:bg-[#1a1a1a]'} ${borderClass} ${isCompleted ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : 'cursor-default'}`}
            onClick={handleCardClick}
        >
            {/* Content - blurred when processing */}
            <div className={`flex-1 flex flex-col min-h-0 ${isProcessing ? 'blur-sm' : ''}`}>
            {/* Header Section */}
            <div className="relative px-4 pt-4 pb-2">
                {thumbnail && (
                    <div className="absolute inset-0">
                        <img src={thumbnail} alt="dataset thumbnail" className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                )}

                <div className="relative z-10">
                    {/* Top Row: Status + Actions */}
                    <div className="flex justify-between items-center mb-4">
                        <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.badge}`}>
                            {isProcessing && <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1.5" />}
                            {statusConfig.text}
                        </div>
                        <div className="flex gap-1.5">
                            <button className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-white dark:bg-white/15 border border-gray-200 dark:border-white/25 hover:bg-gray-100 dark:hover:bg-white/25">
                                <StarIcon className="h-3.5 w-3.5 text-yellow-500" />
                            </button>
                            <button
                                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-white dark:bg-white/15 border border-gray-200 dark:border-white/25 hover:bg-red-50 dark:hover:bg-red-900/30"
                                onClick={(e) => handleDelete(e, dataset.id)}
                            >
                                <TrashIcon className="h-3.5 w-3.5 text-red-500" />
                            </button>
                        </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-left mb-3">
                        <div className="w-14 h-14 rounded-xl shadow-md flex items-center justify-center bg-white dark:bg-white/15 border border-gray-200 dark:border-white/25">
                            <TypeIcon className="h-7 w-7 transition-transform duration-500 ease-out" style={{ color: accentColor }} aria-hidden="true" />
                        </div>
                    </div>

                    {/* Data Type Tag */}
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full shadow-sm bg-gray-100 dark:bg-white/15 border border-gray-200 dark:border-white/25 text-gray-700 dark:text-gray-200">
                        {dataType.replace(/_/g, ' ')}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-4 flex flex-col">
                <h2 className="text-lg font-bold mb-2 truncate leading-tight text-gray-900 dark:text-white">
                    {dataset.title || 'Untitled Dataset'}
                </h2>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-3" />

                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-300">Created</span>
                        <span className="font-semibold truncate mt-0.5 text-gray-900 dark:text-white">{createdAtDisplay}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-300">Files</span>
                        <span className="font-semibold truncate mt-0.5 text-gray-900 dark:text-white">{totalFiles.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-gray-500 dark:text-gray-300">Size</span>
                        <span className="font-semibold mt-0.5 text-gray-900 dark:text-white">
                            {totalSizeKb ? (totalSizeKb / 1024).toFixed(1) + ' MB' : 'N/A'}
                        </span>
                    </div>
                </div>

                {totalAnnotations > 0 && (
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-300">Progress</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {annotatedCount.toLocaleString()} / {totalAnnotations.toLocaleString()}
                            </span>
                        </div>
                        <Progress
                            percent={progress}
                            size="small"
                            strokeColor={isCompleted ? '#10b981' : accentColor}
                            strokeWidth={6}
                            format={(pct) => (
                                <span className="font-semibold text-sm" style={{ color: isCompleted ? '#10b981' : accentColor }}>
                                    {pct}%
                                </span>
                            )}
                        />
                    </div>
                )}
            </div>
            </div>

            {/* Loading overlay - centered when processing */}
            {isProcessing && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-white/10 flex items-center justify-center shadow-lg border border-blue-200/50 dark:border-white/20">
                            <ArrowPathIcon className="h-7 w-7 text-blue-500 dark:text-gray-300 animate-spin" aria-hidden="true" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 dark:text-gray-300">Processing...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
