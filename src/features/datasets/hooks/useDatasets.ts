import { useState, useReducer, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import * as datasetAPI from 'src/features/datasets/api/dataset'
import { POLL_DATASET_PROCESSING_STATUS_TIME } from 'src/constants/time'
import { usePollingStore } from 'src/store/pollingStore'

const pageSize = 9

type Dataset = {
    id: string;
    title?: string;
    processingStatus?: string;
    [key: string]: unknown;
};

type DatasetState = {
    datasets: Dataset[];
    isLoading: boolean;
    showCreator: boolean;
};

type DatasetStatePatch = Partial<DatasetState>;

type LabelProjectValues = {
    name?: string;
    taskType?: string;
    [key: string]: unknown;
};

const initialState = {
    datasets: [],
    isLoading: false,
    showCreator: false,
}

export const useDatasets = () => {
    const [datasetState, updateDataState] = useReducer(
        (state: DatasetState, newState: DatasetStatePatch) => ({ ...state, ...newState }),
        initialState
    )
    const [deletingIds, setDeletingIds] = useState(new Set<string>())
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const [showFilter, setShowFilter] = useState(false)

    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const hasProcessingDatasets = (datasets: Dataset[]) => {
        return Array.isArray(datasets) && datasets.some(ds => ds.processingStatus === 'PROCESSING')
    }

    const updateDatasetStatus = async (datasetId: string) => {
        try {
            const statusData = await datasetAPI.getProcessingStatus(datasetId).then(response => response.data)
            updateDataState({
                datasets: (datasetState.datasets || []).map(ds =>
                    ds.id === datasetId
                        ? { ...ds, processingStatus: statusData.processingStatus }
                        : ds
                )
            })
            return statusData.processingStatus
        } catch (error) {
            console.error(`Error updating status for dataset ${datasetId}:`, error)
            return null
        }
    }

    const startPolling = () => {
        if (pollingRef.current) clearInterval(pollingRef.current)

        pollingRef.current = setInterval(async () => {
            const processingDatasets = (datasetState.datasets || []).filter(
                ds => ds.processingStatus === 'PROCESSING'
            )

            if (processingDatasets.length === 0) {
                clearInterval(pollingRef.current)
                return
            }

            for (const dataset of processingDatasets) {
                const newStatus = await updateDatasetStatus(dataset.id)
                if (newStatus === 'COMPLETED' || newStatus === 'FAILED') {
                    // Additional actions if needed
                }
            }
        }, POLL_DATASET_PROCESSING_STATUS_TIME)
    }

    const getDatasets = async (page = 1) => {
        try {
            updateDataState({ isLoading: true })
            const response = await datasetAPI.getDatasets({ page: page, limit: pageSize })
            console.log('resDa', response)
            updateDataState({
                datasets: Array.isArray(response.data.data) ? response.data.data : [],
                isLoading: false
            })
            setTotalItems(response.data.total || 0)
            setCurrentPage(page)
        } catch (error) {
            console.error('Error fetching datasets:', error)
            updateDataState({ 
                datasets: [],
                isLoading: false 
            })
        }
    }

    const handleCreateDataset = async (createdDataset: Dataset, labelProjectValues: LabelProjectValues) => {
        try {
            toast.success('Dataset created successfully!')
            updateDataState({ showCreator: false })
            // Add to Zustand store for polling
            usePollingStore.getState().addPending({ dataset: createdDataset, labelProjectValues })
            await getDatasets()
        } catch (error) {
            console.error('Error handling created dataset:', error)
        }
    }

    const handleDelete = async (datasetId: string) => {
        setDeletingIds(prev => new Set(prev).add(datasetId))
        try {
            await datasetAPI.deleteDataset(datasetId)
            toast.success('Dataset deleted successfully!')
            await getDatasets()
        } catch (err) {
            console.error('Failed to delete dataset:', err)
            toast.error('Failed to delete dataset')
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(datasetId)
                return newSet
            })
        }
    }

    const handlePageChange = (page: number) => {
        console.log('Pagination clicked. New page:', page)
        setCurrentPage(page)
    }

    const toggleFilter = () => {
        setShowFilter(!showFilter)
    }

    // Effects
    useEffect(() => {
        getDatasets(currentPage)
    }, [currentPage])

    useEffect(() => {
        if (Array.isArray(datasetState.datasets) && datasetState.datasets.length > 0 && hasProcessingDatasets(datasetState.datasets)) {
            startPolling()
        }

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current)
            }
        }
    }, [datasetState.datasets])

    return {
        // State
        datasetState,
        updateDataState,
        deletingIds,
        currentPage,
        totalItems,
        showFilter,
        pageSize,

        // Actions
        getDatasets,
        handleCreateDataset,
        handleDelete,
        handlePageChange,
        toggleFilter,
    }
}
