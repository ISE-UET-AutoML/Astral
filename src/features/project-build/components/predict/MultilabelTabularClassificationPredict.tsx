import { useState, useEffect, useRef } from "react";
import * as modelAPI from "src/features/models/api/model";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Badge } from "src/components/ui/badge";
import { Spinner } from "src/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import { Empty } from "src/components/ui/empty";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { toast } from "sonner";
import {
  CircleCheck,
  CircleX,
  FileText,
  Eye,
  Filter,
  ChevronDown,
  Check,
  Download,
  Pencil,
  Save,
  Menu as MenuIcon,
} from "lucide-react";
import Papa from "papaparse";

const getToastContent = (value) =>
  typeof value === "object" && value?.content ? value.content : value;
const message = {
  success: (value) => toast.success(getToastContent(value)),
  error: (value) => toast.error(getToastContent(value)),
  warning: (value) => toast.warning(getToastContent(value)),
  info: (value) => toast.info(getToastContent(value)),
  loading: (value) => toast.loading(getToastContent(value)),
};

const MultilabelTabularClassificationPredict = ({
  predictResult,
  uploadedFiles,
  projectInfo,
  handleUploadFiles,
  s3_url,
}) => {
  const [csvData, setCsvData] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1); // -1 khi chưa có file
  const [currentPage, setCurrentPage] = useState(1);
  const [incorrectPredictions, setIncorrectPredictions] = useState([]);
  const [statistics, setStatistics] = useState({
    correct: 0,
    incorrect: 0,
    accuracy: 0,
    totalReviewed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [infoDrawerVisible, setInfoDrawerVisible] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({}); // Store edited prediction values
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);

  const fileInputRef = useRef(null);
  const pageSize = 9;

  // Utility function to truncate text with ellipsis (always 50 chars)
  const truncateText = (text) => {
    if (!text || typeof text !== "string") return text;
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  };

  // Check if text is truncated
  const isTextTruncated = (text) => {
    return text && typeof text === "string" && text.length > 50;
  };

  // Edit cell functions
  const handleEditCell = (rowIndex, columnKey, originalValue) => {
    setEditingCell({ rowIndex, columnKey, originalValue });
    setEditValue(originalValue);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const { rowIndex, columnKey } = editingCell;
    const globalIndex = rowIndex + (currentPage - 1) * pageSize;

    // Handle prediction columns differently
    if (columnKey.startsWith("label_") || columnKey === "predictedClass") {
      // Store edited prediction values
      setEditedPredictions((prev) => {
        const newEditedPredictions = {
          ...prev,
          [globalIndex]: {
            ...prev[globalIndex],
            [columnKey]: editValue,
          },
        };

        // If editing a label column, update the Predicted Class automatically
        if (columnKey.startsWith("label_")) {
          const labelIndex = parseInt(columnKey.split("_")[1]);
          const prediction = predictResult[globalIndex];
          const currentEditedPrediction =
            newEditedPredictions[globalIndex] || {};

          // Get all current label values (edited or original)
          const allLabelValues = [];
          if (prediction?.label) {
            prediction.label.forEach((_, idx) => {
              const labelKey = `label_${idx}`;
              const value =
                currentEditedPrediction[labelKey] !== undefined
                  ? currentEditedPrediction[labelKey]
                  : (prediction?.class?.[idx] ?? 0);
              allLabelValues.push(value);
            });
          }

          // Update the current label value
          allLabelValues[labelIndex] = editValue;

          // Build the predicted class string based on active labels
          const activeLabels = [];
          if (prediction?.label) {
            prediction.label.forEach((label, idx) => {
              if (allLabelValues[idx] === 1 || allLabelValues[idx] === "1") {
                activeLabels.push(label);
              }
            });
          }

          // Update the predicted class
          newEditedPredictions[globalIndex] = {
            ...newEditedPredictions[globalIndex],
            predictedClass:
              activeLabels.length > 0
                ? activeLabels.join(", ")
                : "No prediction",
          };
        }

        return newEditedPredictions;
      });
    } else {
      // Update CSV data for regular columns
      setCsvData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnKey]: editValue,
        };
        return newData;
      });

      // Update prediction history
      setPredictionHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        if (newHistory[currentFileIndex]) {
          const newData = [...newHistory[currentFileIndex].data];
          newData[rowIndex] = {
            ...newData[rowIndex],
            [columnKey]: editValue,
          };
          newHistory[currentFileIndex].data = newData;
        }
        return newHistory;
      });
    }

    // Clear editing state
    setEditingCell(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  // Convert binary prediction array to actual labels
  const getPredictedLabels = (prediction, index) => {
    if (!prediction || !prediction.class || !prediction.label) {
      return [];
    }

    // Check if this prediction has been edited
    const editedPrediction = editedPredictions[index];

    // If edited prediction exists, use edited values
    if (editedPrediction && editedPrediction.predictedClass) {
      if (editedPrediction.predictedClass === "No prediction") {
        return [];
      }
      return editedPrediction.predictedClass
        .split(",")
        .map((label) => label.trim())
        .filter((label) => label);
    }

    const binaryArray = prediction.class;
    const labels = prediction.label;

    return binaryArray
      .map((value, index) => (value === 1 ? labels[index] : null))
      .filter((label) => label !== null);
  };

  // Download table data as CSV
  const handleDownload = () => {
    if (!csvData.length) return;

    // Get all visible columns except Actions
    const visibleColumnsForDownload = visibleColumns.filter(
      (col) => col !== "Actions",
    );

    // Prepare data for download
    const downloadData = csvData.map((row, index) => {
      const downloadRow = {};

      // Add CSV data columns
      visibleColumnsForDownload.forEach((col) => {
        if (Object.keys(csvData[0]).includes(col)) {
          downloadRow[col] = row[col];
        }
      });

      // Add label columns
      if (predictResult.length > 0 && predictResult[0]?.label) {
        predictResult[0].label.forEach((label, labelIndex) => {
          const columnKey = `label_${labelIndex}`;
          if (visibleColumnsForDownload.includes(columnKey)) {
            const prediction = predictResult[index];
            const editedPrediction = editedPredictions[index];
            downloadRow[label] =
              editedPrediction?.[columnKey] !== undefined
                ? editedPrediction[columnKey]
                : (prediction?.class?.[labelIndex] ?? "-");
          }
        });
      }

      // Add Predicted Class column
      if (visibleColumnsForDownload.includes("Predicted Class")) {
        const prediction = predictResult[index];
        const editedPrediction = editedPredictions[index];
        let predictedLabels = [];

        if (editedPrediction?.predictedClass) {
          if (editedPrediction.predictedClass === "No prediction") {
            predictedLabels = [];
          } else {
            predictedLabels = editedPrediction.predictedClass
              .split(",")
              .map((label) => label.trim())
              .filter((label) => label);
          }
        } else {
          predictedLabels = getPredictedLabels(prediction, index);
        }

        downloadRow["Predicted Class"] =
          predictedLabels.length > 0
            ? predictedLabels.join(", ")
            : "No prediction";
      }

      return downloadRow;
    });

    // Convert to CSV and download
    const csv = Papa.unparse(downloadData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `prediction_results_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateFeedback = async () => {
    if (!s3_url) {
      message.error("Unable to save feedback: S3 URL is missing.");
      return;
    }

    const feedbackList = csvData.map((row, index) => ({
      index,
      data: row,
      prediction: predictResult[index],
      feedback: incorrectPredictions.includes(index) ? "Incorrect" : "Correct",
    }));

    try {
      setIsSavingFeedback(true);
      await modelAPI.feedbackUpdate(s3_url, feedbackList);
      message.success("Feedback updated successfully");
    } catch (error) {
      console.error("Error updating feedback:", error);
      message.error(error.response?.data?.error || "Failed to update feedback");
    } finally {
      setIsSavingFeedback(false);
    }
  };

  // Parse CSV và cập nhật dữ liệu
  useEffect(() => {
    if (uploadedFiles?.length && uploadedFiles[0]?.name.endsWith(".csv")) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data, meta }) => {
            // Start with all CSV data columns
            const initialVisibleColumns = [...meta.fields];

            // Add label columns if available
            if (predictResult.length > 0 && predictResult[0]?.label) {
              const labelColumns = predictResult[0].label.map(
                (_, index) => `label_${index}`,
              );
              initialVisibleColumns.push(...labelColumns);
            }

            // Add Predicted Class and Actions columns
            initialVisibleColumns.push("Predicted Class", "Actions");
            const initialIncorrect = [];

            // Cập nhật lịch sử
            setPredictionHistory((prev) => {
              const existingIndex = prev.findIndex(
                (item) => item.fileName === uploadedFiles[0].name,
              );
              const newHistoryItem = {
                fileName: uploadedFiles[0].name,
                predictions: predictResult,
                data,
                visibleColumns: initialVisibleColumns,
                incorrectPredictions: initialIncorrect,
              };

              let newHistory;
              if (existingIndex >= 0) {
                // Cập nhật file hiện có
                newHistory = [...prev];
                newHistory[existingIndex] = newHistoryItem;
              } else {
                // Thêm file mới
                newHistory = [...prev, newHistoryItem];
              }

              // Cập nhật currentFileIndex
              setCurrentFileIndex(
                existingIndex >= 0 ? existingIndex : newHistory.length - 1,
              );

              return newHistory;
            });

            // Cập nhật trạng thái hiện tại
            setCsvData(data);
            setVisibleColumns(initialVisibleColumns);
            setIncorrectPredictions(initialIncorrect);
            setCurrentPage(1); // Reset trang
            setLoading(false);
          },
        });
      };
      reader.readAsText(uploadedFiles[0]);
    }
  }, [uploadedFiles, predictResult, projectInfo]);

  // Chuyển đổi giữa các file trong lịch sử
  const handleFileSelect = (index) => {
    if (index >= 0 && index < predictionHistory.length) {
      const selectedItem = predictionHistory[index];
      setCurrentFileIndex(index);
      setCsvData(selectedItem.data);
      setVisibleColumns(selectedItem.visibleColumns);
      setIncorrectPredictions(selectedItem.incorrectPredictions);
      setCurrentPage(1); // Reset trang
      setLoading(false);
    }
  };

  // Cập nhật thống kê
  useEffect(() => {
    const incorrect = incorrectPredictions.length;
    const total = csvData.length;
    const reviewed = Math.min(currentPage * pageSize, total);

    setStatistics({
      correct: total - incorrect,
      incorrect,
      accuracy: total ? (((total - incorrect) / total) * 100).toFixed(1) : 0,
      totalReviewed: reviewed,
    });
  }, [incorrectPredictions, csvData, currentPage]);

  const handlePredictionToggle = (index) => {
    setIncorrectPredictions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
    // Cập nhật predictionHistory
    setPredictionHistory((prev) => {
      const newHistory = [...prev];
      if (newHistory[currentFileIndex]) {
        newHistory[currentFileIndex].incorrectPredictions =
          incorrectPredictions.includes(index)
            ? incorrectPredictions.filter((i) => i !== index)
            : [...incorrectPredictions, index];
      }
      return newHistory;
    });
  };

  const showRowDetails = (record, index) => {
    setSelectedRowData({ record, index });
    setInfoDrawerVisible(true);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      handleUploadFiles(files).finally(() => {
        setUploading(false);
      });
    }
  };

  const handleColumnVisibilityToggle = (column) => {
    setVisibleColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column],
    );
    // Cập nhật predictionHistory
    setPredictionHistory((prev) => {
      const newHistory = [...prev];
      if (newHistory[currentFileIndex]) {
        newHistory[currentFileIndex].visibleColumns = visibleColumns.includes(
          column,
        )
          ? visibleColumns.filter((col) => col !== column)
          : [...visibleColumns, column];
      }
      return newHistory;
    });
  };

  const getFilteredData = () => {
    return csvData;
  };

  const getColumns = () => {
    if (!csvData.length) return [];
    const allColumns = Object.keys(csvData[0]);
    const targetColumn = projectInfo.target_column;

    const baseColumns = allColumns
      .filter((col) => visibleColumns.includes(col))
      .map((col) => ({
        title: col,
        dataIndex: col,
        key: col,
        render: (text, record, rowIdx, globalIndex) => {
          const isEditing =
            editingCell?.rowIndex === rowIdx && editingCell?.columnKey === col;
          const isTrunc = isTextTruncated(text);

          if (isEditing) {
            return (
              <div className="flex items-center gap-1 min-w-[200px]">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 min-w-[120px]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  type="button"
                  aria-label="Save"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                  type="button"
                  aria-label="Cancel"
                >
                  <CircleX className="h-4 w-4" />
                </button>
              </div>
            );
          }

          if (col === targetColumn) {
            return (
              <div className="flex items-center justify-between group">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 cursor-help">
                        {truncateText(text)}
                      </Badge>
                    </TooltipTrigger>
                    {isTrunc && <TooltipContent>{text}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
                {editMode && (
                  <button
                    onClick={() => handleEditCell(rowIdx, col, text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 p-1"
                    type="button"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          }

          return (
            <div className="flex items-center justify-between group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={isTrunc ? "cursor-help" : ""}>
                      {truncateText(text)}
                    </span>
                  </TooltipTrigger>
                  {isTrunc && <TooltipContent>{text}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
              {editMode && (
                <button
                  onClick={() => handleEditCell(rowIdx, col, text)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 p-1"
                  type="button"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        },
      }));

    // Label columns
    const labelColumns = (predictResult[0]?.label || [])
      .map((label, labelIndex) => {
        const columnKey = `label_${labelIndex}`;
        if (!visibleColumns.includes(columnKey)) return null;

        return {
          title: label,
          key: columnKey,
          render: (_, record, rowIdx, globalIndex) => {
            const prediction = predictResult[globalIndex];
            const editedPrediction = editedPredictions[globalIndex];
            const columnKey = `label_${labelIndex}`;
            const value =
              editedPrediction?.[columnKey] !== undefined
                ? editedPrediction[columnKey]
                : (prediction?.class?.[labelIndex] ?? "0");
            const isEditing =
              editingCell?.rowIndex === rowIdx &&
              editingCell?.columnKey === columnKey;

            if (isEditing) {
              return (
                <div className="flex items-center gap-1 min-w-[150px]">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 min-w-[80px]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    onBlur={handleSaveEdit}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                    type="button"
                    aria-label="Save"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                    type="button"
                    aria-label="Cancel"
                  >
                    <CircleX className="h-4 w-4" />
                  </button>
                </div>
              );
            }

            return (
              <div className="flex items-center justify-between group">
                <Badge
                  className={`${value === "0" ? "bg-slate-100 dark:bg-slate-800" : "bg-blue-100 dark:bg-blue-950"} ${value === "0" ? "text-slate-700 dark:text-slate-300" : "text-blue-900 dark:text-blue-200"}`}
                >
                  {value === "0" ? "-" : value}
                </Badge>
                {editMode && (
                  <button
                    onClick={() => handleEditCell(rowIdx, columnKey, value)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 p-1"
                    type="button"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          },
        };
      })
      .filter(Boolean);

    // Predicted Class column
    const conditionalColumns = [];
    if (visibleColumns.includes("Predicted Class")) {
      conditionalColumns.push({
        title: "Predicted Class",
        key: "predictedClass",
        render: (_, record, rowIdx, globalIndex) => {
          const prediction = predictResult[globalIndex];
          const editedPrediction = editedPredictions[globalIndex];
          let predictedLabels = [];

          if (editedPrediction?.predictedClass) {
            if (editedPrediction.predictedClass === "No prediction") {
              predictedLabels = [];
            } else {
              predictedLabels = editedPrediction.predictedClass
                .split(",")
                .map((label) => label.trim())
                .filter((label) => label);
            }
          } else {
            predictedLabels = getPredictedLabels(prediction, globalIndex);
          }

          const isEditing =
            editingCell?.rowIndex === rowIdx &&
            editingCell?.columnKey === "predictedClass";

          if (isEditing) {
            return (
              <div className="flex items-center gap-1 min-w-[250px]">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 min-w-[180px]"
                  autoFocus
                  placeholder="labels, separated, by, commas"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  type="button"
                  aria-label="Save"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                  type="button"
                  aria-label="Cancel"
                >
                  <CircleX className="h-4 w-4" />
                </button>
              </div>
            );
          }

          const isIncorrect = incorrectPredictions.includes(globalIndex);
          const color = isIncorrect
            ? "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200"
            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200";

          return (
            <div className="flex items-center justify-between group">
              <div className="flex flex-wrap gap-2">
                {predictedLabels.length > 0 ? (
                  predictedLabels.map((label, idx) => (
                    <Badge key={idx} className={color}>
                      {label}
                    </Badge>
                  ))
                ) : (
                  <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    No prediction
                  </Badge>
                )}
              </div>
              {editMode && (
                <button
                  onClick={() =>
                    handleEditCell(
                      rowIdx,
                      "predictedClass",
                      predictedLabels.join(", "),
                    )
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 p-1"
                  type="button"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        },
      });
    }

    // Actions column
    if (visibleColumns.includes("Actions")) {
      conditionalColumns.push({
        title: "Actions",
        key: "actions",
        render: (_, record, rowIdx, globalIndex) => {
          const isIncorrect = incorrectPredictions.includes(globalIndex);

          return (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handlePredictionToggle(globalIndex)}
                      className={`inline-flex items-center gap-1 h-8 px-3 rounded-lg text-sm font-medium transition ${
                        isIncorrect
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900"
                          : "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900"
                      }`}
                      type="button"
                    >
                      {isIncorrect ? (
                        <CircleCheck className="h-4 w-4" />
                      ) : (
                        <CircleX className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline text-xs">
                        {isIncorrect ? "Correct" : "Incorrect"}
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isIncorrect ? "Mark as incorrect" : "Mark as correct"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => showRowDetails(record, globalIndex)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      type="button"
                      aria-label="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>View details</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      });
    }

    return [...baseColumns, ...labelColumns, ...conditionalColumns];
  };

  const columns = getColumns();
  const filteredData = getFilteredData();

  // Simple table rendering function
  const renderTable = () => {
    const paginatedData = filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
    );

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              {columns.map((column, index) => (
                <th
                  key={column.key || column.dataIndex || index}
                  className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((record, rowIndex) => {
              const globalIndex = rowIndex + (currentPage - 1) * pageSize;
              const isIncorrect = incorrectPredictions.includes(globalIndex);

              return (
                <tr
                  key={rowIndex}
                  className={`border-b border-slate-200 dark:border-slate-700 ${isIncorrect ? "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                >
                  {columns.map((column, colIndex) => {
                    const value = column.dataIndex
                      ? Array.isArray(column.dataIndex)
                        ? column.dataIndex.reduce((v, key) => v?.[key], record)
                        : record?.[column.dataIndex]
                      : undefined;

                    return (
                      <td
                        key={column.key || column.dataIndex || colIndex}
                        className="px-4 py-3"
                      >
                        {column.render
                          ? column.render(value, record, rowIndex, globalIndex)
                          : value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="px-3 text-sm text-slate-600 dark:text-slate-400">
              Page {currentPage} of{" "}
              {Math.ceil(filteredData.length / pageSize) || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(filteredData.length / pageSize),
                    currentPage + 1,
                  ),
                )
              }
              disabled={
                currentPage >= Math.ceil(filteredData.length / pageSize)
              }
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="mb-8">
        <Card className="rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <CardTitle className="text-2xl text-slate-900 dark:text-white mb-1">
                  Prediction Dashboard
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Review and validate your model predictions
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* File selector dropdown */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {predictionHistory[currentFileIndex]?.fileName ||
                            "Select file"}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Upload or switch file</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Columns visibility button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setSelectedRowData(null);
                          setInfoDrawerVisible(true);
                        }}
                        className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Columns</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Configure visible columns</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Download button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDownload}
                        disabled={!csvData.length}
                        className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Download as CSV</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Update feedback button */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleUpdateFeedback}
                        disabled={!csvData.length || isSavingFeedback}
                        className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSavingFeedback && <Spinner className="h-4 w-4" />}
                        <Check className="h-4 w-4" />
                        <span className="hidden sm:inline">Update</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Save feedback</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                  accept=".csv"
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* File history dropdown menu */}
        {predictionHistory.length > 1 && (
          <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Prediction History
            </p>
            <div className="flex flex-wrap gap-2">
              {predictionHistory.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleFileSelect(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    index === currentFileIndex
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {item.fileName}
                    {index === currentFileIndex && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      {loading ? (
        <Card className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center gap-3">
              <Spinner className="h-8 w-8" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Loading prediction data...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : csvData.length > 0 ? (
        <Card className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-900 dark:text-white">
                Prediction Results ({csvData.length} items)
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setEditMode(!editMode);
                        if (editMode) {
                          handleCancelEdit();
                        }
                      }}
                      className={`h-9 px-3 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                        editMode
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Pencil className="h-4 w-4" />
                      {editMode ? "Exit Edit" : "Edit Mode"}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {editMode ? "Exit edit mode" : "Enable edit mode"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="p-0">{renderTable()}</CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-slate-400 dark:text-slate-600">
                <FileText className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 text-lg font-medium mb-1">
                  No prediction data available
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  Upload a CSV file to start reviewing predictions
                </p>
              </div>
              <button
                onClick={handleClick}
                disabled={uploading}
                className="h-12 px-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploading && <Spinner className="h-4 w-4" />}
                Upload a file to start
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Dialog for columns and details */}
      <Dialog open={infoDrawerVisible} onOpenChange={setInfoDrawerVisible}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedRowData ? "Prediction Details" : "Column Visibility"}
            </DialogTitle>
          </DialogHeader>

          {selectedRowData ? (
            <div className="space-y-6">
              {/* Data Fields Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Data Fields
                  </h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(selectedRowData.record).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                      >
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {key}
                        </p>
                        {key === projectInfo.target_column ? (
                          <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200">
                            {value}
                          </Badge>
                        ) : (
                          <p className="text-slate-800 dark:text-slate-200 text-sm break-words">
                            {value}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Prediction Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Prediction
                  </h3>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                    Predicted {projectInfo.target_column}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const prediction = predictResult[selectedRowData.index];
                      const editedPrediction =
                        editedPredictions[selectedRowData.index];
                      let predictedLabels = [];

                      if (editedPrediction?.predictedClass) {
                        if (
                          editedPrediction.predictedClass === "No prediction"
                        ) {
                          predictedLabels = [];
                        } else {
                          predictedLabels = editedPrediction.predictedClass
                            .split(",")
                            .map((label) => label.trim())
                            .filter((label) => label);
                        }
                      } else {
                        predictedLabels = getPredictedLabels(
                          prediction,
                          selectedRowData.index,
                        );
                      }

                      return predictedLabels.length > 0 ? (
                        predictedLabels.map((label, idx) => (
                          <Badge
                            key={idx}
                            className="bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200"
                          >
                            {label}
                          </Badge>
                        ))
                      ) : (
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          No prediction
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Mark prediction button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handlePredictionToggle(selectedRowData.index)}
                  className={`w-full h-12 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    incorrectPredictions.includes(selectedRowData.index)
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900"
                      : "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900"
                  }`}
                >
                  {incorrectPredictions.includes(selectedRowData.index) ? (
                    <>
                      <CircleCheck className="h-4 w-4" />
                      Mark as Incorrect
                    </>
                  ) : (
                    <>
                      <CircleX className="h-4 w-4" />
                      Mark as Correct
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400">
                Select which columns to display in the table for better data
                visualization.
              </p>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Available Columns
                  </h3>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {/* CSV Data Columns */}
                  {csvData.length > 0 &&
                    Object.keys(csvData[0]).map((column) => (
                      <div
                        key={column}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(column)}
                            onChange={() =>
                              handleColumnVisibilityToggle(column)
                            }
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                          />
                          <div>
                            <p
                              className={`text-sm font-medium ${column === projectInfo.target_column ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}
                            >
                              {column}
                            </p>
                            {column === projectInfo.target_column && (
                              <Badge className="mt-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs">
                                Target
                              </Badge>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}

                  {/* Label Columns */}
                  {predictResult.length > 0 &&
                    predictResult[0]?.label &&
                    predictResult[0].label.map((label, index) => {
                      const columnKey = `label_${index}`;
                      return (
                        <div
                          key={columnKey}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(columnKey)}
                              onChange={() =>
                                handleColumnVisibilityToggle(columnKey)
                              }
                              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                            />
                            <div>
                              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {label}
                              </p>
                              <Badge className="mt-1 bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 text-xs">
                                Prediction
                              </Badge>
                            </div>
                          </label>
                        </div>
                      );
                    })}

                  {/* Predicted Class Column */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes("Predicted Class")}
                        onChange={() =>
                          handleColumnVisibilityToggle("Predicted Class")
                        }
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          Predicted Class
                        </p>
                        <Badge className="mt-1 bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 text-xs">
                          Summary
                        </Badge>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => {
                setInfoDrawerVisible(false);
                setSelectedRowData(null);
              }}
              className="h-10 px-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultilabelTabularClassificationPredict;
