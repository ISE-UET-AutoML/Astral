import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { Input } from "src/components/ui/input";
import { Separator } from "src/components/ui/separator";
import { Spinner } from "src/components/ui/spinner";
import { AlertCircle, Plus, X } from "lucide-react";
import { getDatasets } from "src/features/datasets/api/dataset";
import { TASK_TYPES } from "src/constants/types";

interface Dataset {
  id: string;
  title: string;
  quantity: number;
  dataType: string;
  processingStatus: string;
  detectedLabels?: string[];
  metaData?: Record<string, any>;
}

interface ColumnOption {
  value: string;
  label: string;
  uniqueClassCount: number;
}

export default function CreateLabelProjectModal({
  visible,
  onCancel,
  onCreate,
}: {
  visible: boolean;
  onCancel: () => void;
  onCreate: (data: any) => Promise<void>;
}) {
  // Form state
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState("");
  const [datasetId, setDatasetId] = useState("");
  const [newLabel, setNewLabel] = useState("");

  // Data state
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [expectedLabels, setLabels] = useState<string[]>([]);
  const [columnOptions, setColumnOptions] = useState<ColumnOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset form on dialog open/close
  useEffect(() => {
    if (visible) {
      fetchDatasets();
      setProjectName("");
      setDescription("");
      setTaskType("");
      setDatasetId("");
      setNewLabel("");
      setLabels([]);
      setColumnOptions([]);
    }
  }, [visible]);

  // Reset dataset when task type changes
  useEffect(() => {
    setDatasetId("");
  }, [taskType]);

  const fetchDatasets = async () => {
    try {
      const response = (await getDatasets({})) as any;
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setDatasets(data);
    } catch (error) {
      console.error("Error fetching datasets:", error);
      setDatasets([]);
    }
  };

  // Update labels and column options when dataset changes
  useEffect(() => {
    const datasetsArray = Array.isArray(datasets) ? datasets : [];
    const selectedDataset = datasetsArray.find((ds) => ds.id === datasetId);

    setLabels([]);
    setColumnOptions([]);

    if (!selectedDataset) return;

    if (
      selectedDataset.dataType === "IMAGE" &&
      selectedDataset.detectedLabels &&
      selectedDataset.detectedLabels.length > 0
    ) {
      setLabels(selectedDataset.detectedLabels);
    }

    if (
      (selectedDataset.dataType === "TEXT" ||
        selectedDataset.dataType === "TABULAR" ||
        selectedDataset.dataType === "MULTIMODAL") &&
      selectedDataset.metaData?.columns
    ) {
      const columns = selectedDataset.metaData.columns;
      const options = Object.entries(columns).map(
        ([key, val]: [string, any]) => {
          const count = val.uniqueClassCount ?? val.unique_class_count ?? 0;
          return {
            value: key,
            label: `${key} (${count} classes)`,
            uniqueClassCount: count,
          };
        },
      );
      setColumnOptions(options);
    }
  }, [datasetId, datasets]);

  const handleAddLabel = () => {
    const v = newLabel.trim();
    if (v && !expectedLabels.includes(v)) {
      setLabels((prev) => [...prev, v]);
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels((prev) => prev.filter((l) => l !== labelToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || expectedLabels.length === 0) return;

    setLoading(true);
    try {
      const selectedLabel = expectedLabels[0];
      const column = columnOptions.find((opt) => opt.value === selectedLabel);
      const uniqueClassCount = column?.uniqueClassCount ?? 0;
      const is_binary_class = uniqueClassCount === 2;

      const payload = {
        name: projectName,
        description,
        taskType,
        datasetId,
        expectedLabels,
        meta_data: {
          is_binary_class,
        },
      };

      await onCreate(payload);
      handleCancel();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProjectName("");
    setDescription("");
    setTaskType("");
    setDatasetId("");
    setNewLabel("");
    setLabels([]);
    setColumnOptions([]);
    onCancel();
  };

  const projectTypes = Object.entries(TASK_TYPES).map(
    ([key, cfg]: [string, any]) => ({
      value: key,
      label: cfg.type,
    }),
  );

  const requiredDataType = taskType
    ? (TASK_TYPES as any)[taskType]?.dataType
    : null;
  const datasetsArray = Array.isArray(datasets) ? datasets : [];
  const filtered = datasetsArray.filter(
    (ds) => ds.dataType === requiredDataType,
  );

  return (
    <Dialog open={visible} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Label Project</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set up a new labeling project for your dataset
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Project Name
            </label>
            <Input
              placeholder="Enter project name (3+ characters)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              minLength={3}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Description
            </label>
            <textarea
              placeholder="Enter project description (optional)"
              maxLength={500}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-gray-400"
            />
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Task Type
            </label>
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
            >
              <option value="">Select task type</option>
              {projectTypes.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dataset Selection */}
          {requiredDataType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Dataset
              </label>
              <select
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
              >
                <option value="">
                  {requiredDataType
                    ? `Select a ${requiredDataType.toLowerCase()} dataset`
                    : "Please select task type first"}
                </option>
                {filtered.map((ds) => (
                  <option
                    key={ds.id}
                    value={ds.id}
                    disabled={ds.processingStatus !== "COMPLETED"}
                  >
                    {ds.title} ({ds.quantity} items) - {ds.processingStatus}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Expected Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              Expected Labels
            </label>
            {columnOptions.length > 0 ? (
              <select
                value={expectedLabels[0] || ""}
                onChange={(e) =>
                  setLabels(e.target.value ? [e.target.value] : [])
                }
                required
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
              >
                <option value="">Select label column</option>
                {columnOptions.map((col) => (
                  <option key={col.value} value={col.value}>
                    {col.label}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Enter label name"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
                  />
                  <button
                    type="button"
                    onClick={handleAddLabel}
                    disabled={!newLabel.trim()}
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/20 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
                    aria-label="Add label"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {expectedLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {expectedLabels.map((label) => (
                      <div
                        key={label}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-200"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => handleRemoveLabel(label)}
                          className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-blue-200 dark:hover:bg-blue-900"
                          aria-label="Remove label"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert variant="default" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      At least one expected label is required to create a
                      project.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>

          <Separator className="my-6" />

          <DialogFooter>
            <button
              type="button"
              onClick={handleCancel}
              className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                expectedLabels.length === 0 || loading || !projectName.trim()
              }
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Spinner className="h-4 w-4" />}
              Create Project
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
