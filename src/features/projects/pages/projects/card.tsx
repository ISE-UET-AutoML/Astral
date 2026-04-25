import React, { useState } from 'react'
import { Box as CubeTransparentIcon, Star as StarIcon, Trash as TrashIcon, FileText as DocumentTextIcon, Image as PhotoIcon, Table as TableCellsIcon, Puzzle as PuzzlePieceIcon, TrendingUp as ArrowTrendingUpIcon, RefreshCw as ArrowPathIcon } from 'lucide-react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { PATHS } from 'src/constants/paths'
import { deleteProject } from 'src/features/projects/api/project'
import { Spinner as Spin } from 'src/components/ui/spinner'
import { toast } from 'sonner'
import image_classification from 'src/assets/images/image_classification.jpg'
import text_classification from 'src/assets/images/text_classification.jpg'
import multilabel_text_classification from 'src/assets/images/multilabel_text_classification.jpg'
import tabular_classification from 'src/assets/images/tabular_classification.jpg'
import tabular_regression from 'src/assets/images/tabular_regression.jpg'
import multilabel_tabular_classification from 'src/assets/images/multilabel_tabular_classification.jpg'
import multimodal_classification from 'src/assets/images/multimodal_classification.jpg'
import multilabel_image_classification from 'src/assets/images/multilabel_image_classification.jpg'
import object_detection from 'src/assets/images/object_detection.jpg'
import semantic_segmentation from 'src/assets/images/semantic_segmentation.jpg'
import time_series_forecasting from 'src/assets/images/time_series_forecasting.jpg'
import clustering from 'src/assets/images/clustering.jpeg'
import anomaly_detection from 'src/assets/images/anomaly_detection.JPG'
import audio_classification from 'src/assets/images/audio_classification.jpeg'
import video_classification from 'src/assets/images/video_classification.jpeg'


dayjs.extend(relativeTime)

export default function ProjectCard({ project, getProjects }) {
    const [isStarred, setIsStarred] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleStarClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsStarred(!isStarred)
    }

    const handleDelete = async (e, projectID) => {
        e.preventDefault()
        e.stopPropagation()
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                setIsDeleting(true)
                await deleteProject(projectID)
                toast.success('Project deleted successfully!')
                getProjects()
            } catch (error) {
                toast.error('Failed to delete project. Please try again.')
                console.error(error)
            } finally {
                setIsDeleting(false)
            }
        }
    }

    const taskType = project?.task_type

    const getTaskBackgroundImage = (taskType) => {
        const imageMap = {
            IMAGE_CLASSIFICATION: image_classification,
            TEXT_CLASSIFICATION: text_classification,
            MULTILABEL_TEXT_CLASSIFICATION: multilabel_text_classification,
            TABULAR_CLASSIFICATION: tabular_classification,
            TABULAR_REGRESSION: tabular_regression,
            MULTILABEL_TABULAR_CLASSIFICATION: multilabel_tabular_classification,
            MULTIMODAL_CLASSIFICATION: multimodal_classification,
            MULTILABEL_IMAGE_CLASSIFICATION: multilabel_image_classification,
            OBJECT_DETECTION: object_detection,
            SEMANTIC_SEGMENTATION: semantic_segmentation,
            TIME_SERIES_FORECASTING: time_series_forecasting,
            CLUSTERING: clustering,
            ANOMALY_DETECTION: anomaly_detection,
            AUDIO_CLASSIFICATION: audio_classification,
            VIDEO_CLASSIFICATION: video_classification,
        }
        return imageMap[taskType] || image_classification
    }

    let IconComponent = CubeTransparentIcon
    if (taskType?.includes('TEXT')) IconComponent = DocumentTextIcon
    else if (taskType?.includes('IMAGE')) IconComponent = PhotoIcon
    else if (taskType?.includes('TABULAR')) IconComponent = TableCellsIcon
    else if (taskType?.includes('SEGMENTATION')) IconComponent = PuzzlePieceIcon
    else if (taskType?.includes('TIME_SERIES')) IconComponent = ArrowTrendingUpIcon

    const handleCardClick = () => {
        window.location.href = PATHS.PROJECT_INFO(project?.id)
    }

    const runningCount = (project?.training_experiments || 0) + (project?.setting_experiments || 0)
    const doneCount = project?.done_experiments || 0
    const totalExperiments = runningCount + doneCount
    let projectStatus = 'Pending'

    if (runningCount > 0) {
        projectStatus = 'Training'
    } else if (doneCount > 0) {
        projectStatus = 'Completed'
    }

    const statusConfig = {
        Pending: {
            badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30',
            border: 'border-amber-400/60 shadow-amber-500/10',
        },
        Training: {
            badge: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30',
            border: 'border-blue-400/60 shadow-blue-500/10',
        },
        Completed: {
            badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30',
            border: 'border-emerald-400/60 shadow-emerald-500/10',
        },
    }

    const accentConfig = {
        IMAGE: { bg: 'bg-violet-100 dark:bg-violet-500/20', icon: 'text-violet-600 dark:text-violet-300' },
        TEXT: { bg: 'bg-indigo-100 dark:bg-indigo-500/20', icon: 'text-indigo-600 dark:text-indigo-300' },
        TABULAR: { bg: 'bg-sky-100 dark:bg-sky-500/20', icon: 'text-sky-600 dark:text-sky-300' },
        SEGMENTATION: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20', icon: 'text-fuchsia-600 dark:text-fuchsia-300' },
        TIME_SERIES: { bg: 'bg-cyan-100 dark:bg-cyan-500/20', icon: 'text-cyan-600 dark:text-cyan-300' },
    }

    const accentKey = Object.keys(accentConfig).find((key) => taskType?.includes(key))
    const accent = accentConfig[accentKey] || { bg: 'bg-blue-100 dark:bg-blue-500/20', icon: 'text-blue-600 dark:text-blue-300' }
    const currentStatus = statusConfig[projectStatus]
    const taskImage = getTaskBackgroundImage(taskType)

    return (
        <Spin spinning={isDeleting} tip="Deleting..." size="large">
            <div
                key={project.id}
                className={`group rounded-2xl shadow-lg w-full min-h-[360px] overflow-hidden font-poppins cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col relative bg-white dark:[background:var(--card-gradient)] border-2 ${currentStatus.border}`}
                onClick={handleCardClick}
            >
                <div className="relative px-4 pt-4 pb-2">
                    <div className="absolute inset-0">
                        <img
                            src={taskImage}
                            alt={project?.task_type || 'project type'}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 dark:bg-black/45" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className={`px-2.5 py-1 rounded-full text-xs font-medium border ${currentStatus.badge}`}>
                                {projectStatus === 'Training' && (
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1.5" />
                                )}
                                {projectStatus}
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-white/95 dark:bg-slate-900/75 backdrop-blur-md border border-gray-200 dark:border-white/15 hover:bg-gray-100 dark:hover:bg-slate-800/90"
                                    onClick={handleStarClick}
                                >
                                    <StarIcon
                                        className={`h-3.5 w-3.5 ${isStarred ? 'fill-yellow-400 text-yellow-500' : 'text-yellow-500 dark:text-yellow-300'}`}
                                    />
                                </button>
                                <button
                                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-white/95 dark:bg-slate-900/75 backdrop-blur-md border border-gray-200 dark:border-white/15 hover:bg-red-50 dark:hover:bg-red-900/35"
                                    onClick={(e) => handleDelete(e, project.id)}
                                    disabled={isDeleting}
                                >
                                    <TrashIcon className="h-3.5 w-3.5 text-red-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-left mb-3">
                            <div className="w-14 h-14 rounded-xl shadow-md flex items-center justify-center bg-white/95 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-white/15">
                                <IconComponent
                                    className={`h-7 w-7 transition-transform duration-500 ease-out ${accent.icon}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full shadow-sm border bg-white/95 dark:bg-slate-900/80 backdrop-blur-md border-gray-200 dark:border-white/15 text-gray-800 dark:text-white">
                            <IconComponent className={`h-3.5 w-3.5 ${accent.icon}`} aria-hidden="true" />
                            {project?.task_type?.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                <div className="flex-1 px-5 py-4 flex flex-col">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold mb-1 truncate leading-tight text-gray-900 dark:text-white">
                            {project?.name}
                        </h2>
                        <p className="text-sm leading-relaxed mb-4 text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[40px]">
                            {project?.description || 'No description'}
                        </p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent mb-3" />

                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex flex-col">
                            <span className="text-gray-500 dark:text-gray-400">Created</span>
                            <span className="font-semibold truncate mt-0.5 text-gray-900 dark:text-white">
                                {dayjs(project?.created_at).format('MMM DD, YYYY')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 dark:text-gray-400">Runs</span>
                            <span className="font-semibold truncate mt-0.5 text-gray-900 dark:text-white">
                                {totalExperiments}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-500 dark:text-gray-400">Done</span>
                            <span className="font-semibold truncate mt-0.5 text-gray-900 dark:text-white">
                                {doneCount}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </Spin>
    )
}
