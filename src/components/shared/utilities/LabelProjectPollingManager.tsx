import { useEffect, useRef } from 'react';
import { usePollingStore } from 'src/store/pollingStore';
import * as datasetAPI from 'src/features/datasets/api/dataset';
import * as labelProjectAPI from 'src/features/labels/api/labelProject';
import { toast } from 'sonner';

type PendingLabelProject = {
  dataset: {
    id: string;
    title?: string;
  };
  labelProjectValues: {
    name: string;
    taskType: string;
    expectedLabels?: unknown;
    description?: string;
    meta_data?: Record<string, unknown>;
  };
};

type RemovePending = (datasetId: string) => void;

const handleCompletedDataset = async (item: PendingLabelProject, removingPending: RemovePending) => {
  const {dataset, labelProjectValues} = item;
  try {
    const payload = {
      name: labelProjectValues.name,
      taskType: labelProjectValues.taskType,
      datasetId: dataset.id,
      expectedLabels: labelProjectValues.expectedLabels,
      description: labelProjectValues.description || '',
      meta_data: labelProjectValues.meta_data || {},
    }
    console.log(`Dataset '${dataset.title}' is COMPLETED. Creating label project...`);
    await labelProjectAPI.createLbProject(payload);
  } catch (err) {
    console.error(`Error while creating label project '${dataset.title}':`, err);
  } finally {
    removingPending(dataset.id);
  }
}

export default function LabelProjectPollingManager() {
  const { pendingLabelProjects, removePending } = usePollingStore();
  const beingProcessed = useRef(new Set<string>());
  const refreshDatasets = async () => {
    try {
      // Gọi API để refresh datasets
      await datasetAPI.getDatasets({});
    } catch (error) {
      console.error('Error refreshing datasets:', error);
    }
  };

  const refreshLabelProjects = async () => {
    try {
      // Gọi API để refresh label projects và sync annotations
      await labelProjectAPI.getLbProjects(undefined);
    } catch (error) {
      console.error('Error refreshing label projects:', error);
    }
  };

  useEffect(() => {
    if (pendingLabelProjects.length === 0) return;
    
    const processPendingItems = async () => {
      for (const item of pendingLabelProjects as PendingLabelProject[]) {
        const { dataset } = item;

        if (beingProcessed.current.has(dataset.id)) {
          continue;
        }

        try {
          const res = await datasetAPI.getProcessingStatus(dataset.id);
          const status = res.data?.processingStatus;
          console.log(res);
          // Nếu đã hoàn thành, bắt đầu xử lý
          if (status === 'COMPLETED') {
            // Đánh dấu là đang xử lý
            beingProcessed.current.add(dataset.id);
            // Gọi hàm xử lý riêng biệt mà không cần chờ (non-blocking)
            handleCompletedDataset(item, removePending);
            console.log(item);
          } else if (status === 'FAILED') {
            toast.error(`Dataset '${dataset.title}' failed to process.`);
            removePending(dataset.id);
            beingProcessed.current.add(dataset.id); 
          }
        } catch (err) {
          console.error(`Lỗi polling cho dataset '${dataset.id}':`, err);
        } 
      }
    };
    processPendingItems();
    const intervalId = setInterval(processPendingItems, 5000);

    return () => clearInterval(intervalId);
  }, [pendingLabelProjects, removePending]);

  return null; // Component này không render gì cả
} 
