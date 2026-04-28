import { useState, useReducer, useEffect, useRef } from "react";
import { toast } from "sonner";
import CreateDatasetModal from "./CreateDatasetModal";
import ContentContainer from "src/layouts/ContentContainer";
import Pager from "src/components/shared/data-display/Pager";
import * as datasetAPI from "src/features/datasets/api/dataset";
import * as labelProjectAPI from "src/features/labels/api/labelProject";
import { POLL_DATASET_PROCESSING_STATUS_TIME } from "src/constants/time";
import {
  DatasetHeader,
  DatasetFilter,
  DatasetGrid,
} from "src/features/datasets/components";

const pageSize = 6;

const initialState = {
  datasets: [],
  isLoading: false,
  showCreator: false,
};

export default function Datasets() {
  // filter + sort state
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // reducer state
  const [datasetState, updateDataState] = useReducer((state, newState) => {
    const evaluatedState =
      typeof newState === "function" ? newState(state) : newState;
    return { ...state, ...evaluatedState };
  }, initialState);

  const [deletingIds, setDeletingIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // polling
  const pollingRef = useRef(null);

  const isProcessingStatus = (status) =>
    ["PROCESSING", "CREATING_DATASET", "CREATING_LABEL_PROJECT"].includes(
      status,
    );

  const hasProcessingDatasets = (datasets) =>
    datasets.some((ds) => isProcessingStatus(ds.processingStatus));

  const updateDatasetStatus = async (datasetId) => {
    try {
      const statusData = await datasetAPI
        .getProcessingStatus(datasetId)
        .then((res) => res.data);

      updateDataState((prevState) => ({
        datasets: prevState.datasets.map((ds) =>
          ds.id === datasetId
            ? {
                ...ds,
                processingStatus: statusData.processingStatus,
              }
            : ds,
        ),
      }));
      return statusData.processingStatus;
    } catch (error) {
      console.error(`Error updating status for dataset ${datasetId}:`, error);
      return null;
    }
  };

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    pollingRef.current = setInterval(async () => {
      const processingDatasets = datasetState.datasets.filter((ds) =>
        isProcessingStatus(ds.processingStatus),
      );

      if (processingDatasets.length === 0) {
        clearInterval(pollingRef.current);
        return;
      }

      for (const dataset of processingDatasets) {
        const newStatus = await updateDatasetStatus(dataset.id);
        if (newStatus === "COMPLETED" || newStatus === "FAILED") {
          // Lấy toàn bộ info mới nhất của dataset để cập nhật giao diện (ảnh, tiến độ label...)
          try {
            const res = await datasetAPI.getDataset(dataset.id);
            const updatedDataset = res?.data;
            if (updatedDataset) {
              updateDataState((prevState) => {
                const updatedDatasets = prevState.datasets.map((ds) => {
                  if (ds.id === dataset.id) {
                    return { ...ds, ...updatedDataset };
                  }
                  return ds;
                });
                return { datasets: updatedDatasets };
              });
            }
          } catch (error) {
            console.error(
              "Lỗi khi fetch dataset info sau khi complete:",
              error,
            );
          }
        }
      }
    }, POLL_DATASET_PROCESSING_STATUS_TIME);
  };

  const getDatasets = async (page = 1) => {
    try {
      updateDataState({ isLoading: true });

      const response = await datasetAPI.getDatasets({
        page,
        limit: pageSize,
        search: searchTerm || undefined,
        data_type: selectedType === "None" ? undefined : selectedType,
        sort_by: sortBy,
      });

      updateDataState({
        datasets: response.data.data,
        isLoading: false,
      });
      setTotalItems(response.data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      updateDataState({ isLoading: false });
    }
  };

  const handleCreateDataset = async (createdDataset, labelProjectValues) => {
    try {
      toast.success("Dataset created successfully!");
      updateDataState({ showCreator: false });
      labelProjectAPI.pollingToCreateLabelProject(
        createdDataset.id,
        labelProjectValues,
      );
      // usePollingStore
      // 	.getState()
      // 	.addPending({ dataset: createdDataset, labelProjectValues })
      await getDatasets(1);
    } catch (error) {
      console.error("Error handling created dataset:", error);
    }
  };

  const handleDelete = async (datasetId) => {
    setDeletingIds((prev) => new Set(prev).add(datasetId));
    try {
      await datasetAPI.deleteDataset(datasetId);
      toast.success("Dataset deleted successfully!");
      await getDatasets(currentPage);
    } catch (err) {
      console.error("Failed to delete dataset:", err);
      toast.error("Failed to delete dataset");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(datasetId);
        return newSet;
      });
    }
  };

  // Effects
  useEffect(() => {
    getDatasets(currentPage);
  }, [currentPage, selectedType, searchTerm, sortBy]);

  useEffect(() => {
    if (
      datasetState.datasets.length > 0 &&
      hasProcessingDatasets(datasetState.datasets)
    ) {
      startPolling();
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [datasetState.datasets]);

  const handleResetFilters = () => {
    setSelectedType(null);
    setSearchTerm("");
    setSortBy("latest");
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--surface)] text-gray-900 dark:text-white">
      <div className="min-h-screen pt-12 bg-white dark:bg-[var(--surface)]">
        <main className="relative pt-20 px-6 pb-20">
          <ContentContainer className="relative z-10">
            {/* Header */}
            <DatasetHeader
              onNewDataset={() => updateDataState({ showCreator: true })}
            />

            {/* Filter */}
            <DatasetFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onReset={handleResetFilters}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Grid */}
            <DatasetGrid
              datasets={datasetState.datasets}
              isLoading={datasetState.isLoading}
              deletingIds={deletingIds}
              onDelete={handleDelete}
              onCreateDataset={() => updateDataState({ showCreator: true })}
              getDatasets={getDatasets}
            />

            {/* Pager */}
            <div className="mt-8">
              <Pager
                currentPage={currentPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          </ContentContainer>
        </main>
      </div>

      <CreateDatasetModal
        visible={datasetState.showCreator}
        onCancel={() => updateDataState({ showCreator: false })}
        onCreate={handleCreateDataset}
      />
    </div>
  );
}
