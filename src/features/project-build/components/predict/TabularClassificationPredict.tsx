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
} from "lucide-react";
import Papa from "papaparse";

const getToastContent = (value: any) =>
  typeof value === "object" && value?.content ? value.content : value;
const message = {
  success: (value: any) => toast.success(getToastContent(value)),
  error: (value: any) => toast.error(getToastContent(value)),
  warning: (value: any) => toast.warning(getToastContent(value)),
  info: (value: any) => toast.info(getToastContent(value)),
  loading: (value: any) => toast.loading(getToastContent(value)),
};

const TabularClassificationPredict = ({
  predictResult = [],
  uploadedFiles = [],
  projectInfo = { target_column: "" },
  handleUploadFiles = () => {},
  model = {},
  s3_url = "",
}: any) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1); // -1 khi chưa có file
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [incorrectPredictions, setIncorrectPredictions] = useState<number[]>(
    [],
  );
  const [statistics, setStatistics] = useState<{
    correct: number;
    incorrect: number;
    accuracy: string;
    totalReviewed: number;
  }>({
    correct: 0,
    incorrect: 0,
    accuracy: "0",
    totalReviewed: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [infoDrawerVisible, setInfoDrawerVisible] = useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = useState<{
    record: any;
    index: number;
  } | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    columnKey: string;
    originalValue: any;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedPredictions, setEditedPredictions] = useState<
    Record<number, any>
  >({}); // Store edited prediction values
  const [isSavingFeedback, setIsSavingFeedback] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 9;

  // Get the predicted class column name from model metadata
  const getPredictedClassColumnName = () => {
    return model?.metadata?.label_column || "Predicted Class";
  };

  console.log("model", model);

  // Utility function to truncate text with ellipsis (always 50 chars)
  const truncateText = (text: any) => {
    if (!text || typeof text !== "string") return text;
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  };

  // Check if text is truncated
  const isTextTruncated = (text: any) => {
    return text && typeof text === "string" && text.length > 50;
  };

  // Edit cell functions
  const handleEditCell = (
    rowIndex: number,
    columnKey: string,
    originalValue: any,
  ) => {
    setEditingCell({ rowIndex, columnKey, originalValue });
    setEditValue(originalValue);
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const { rowIndex, columnKey } = editingCell;
    const globalIndex = rowIndex + (currentPage - 1) * pageSize;

    // Handle prediction columns differently
    if (columnKey === "predictedClass" || columnKey === "confidence") {
      // Store edited prediction values
      setEditedPredictions((prev: Record<number, any>) => ({
        ...prev,
        [globalIndex]: {
          ...(prev[globalIndex] || {}),
          [columnKey === "predictedClass" ? "class" : "confidence"]: editValue,
        },
      }));
    } else {
      // Update CSV data for regular columns
      setCsvData((prevData: any[]) => {
        const newData = [...prevData];
        newData[rowIndex] = {
          ...newData[rowIndex],
          [columnKey]: editValue,
        };
        return newData;
      });

      // Update prediction history
      setPredictionHistory((prevHistory: any[]) => {
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

  // Convert prediction object to display format
  const getPredictedInfo = (
    prediction: any,
    index: number,
  ): { key: any; class: any; confidence: any } => {
    if (!prediction || typeof prediction !== "object") {
      return { key: null, class: null, confidence: null };
    }

    // Check if this prediction has been edited
    const editedPrediction = editedPredictions[index] as
      | Record<string, any>
      | undefined;

    return {
      key: prediction.key ?? null,
      class:
        editedPrediction?.class !== undefined
          ? editedPrediction.class
          : (prediction.class ?? null),
      confidence:
        editedPrediction?.confidence !== undefined
          ? editedPrediction.confidence
          : prediction.confidence
            ? parseFloat(prediction.confidence).toFixed(2)
            : null,
    };
  };

  // Download table data as CSV
  const handleDownload = () => {
    if (!csvData.length) return;

    // Get all visible columns except Actions
    const visibleColumnsForDownload: string[] = visibleColumns.filter(
      (col: string) => col !== "Actions",
    );

    // Prepare data for download
    const downloadData = csvData.map((row: any, index: number) => {
      const downloadRow: any = {};

      // Add CSV data columns
      visibleColumnsForDownload.forEach((col: string) => {
        if (Object.keys(csvData[0]).includes(col)) {
          downloadRow[col] = row[col];
        }
      });

      // Add prediction columns
      const predictedClassColumnName = getPredictedClassColumnName();
      if (visibleColumnsForDownload.includes(predictedClassColumnName)) {
        const prediction = predictResult[index];
        const predictedInfo = getPredictedInfo(prediction, index);
        downloadRow[predictedClassColumnName] =
          predictedInfo.class !== null ? predictedInfo.class : "-";
      }

      if (visibleColumnsForDownload.includes("Confidence")) {
        const prediction = predictResult[index];
        const predictedInfo = getPredictedInfo(prediction, index);
        downloadRow["Confidence"] =
          predictedInfo.confidence !== null ? predictedInfo.confidence : "-";
      }

      // Add Feedback column based on incorrectPredictions state
      const isIncorrect = incorrectPredictions.includes(index);
      downloadRow["Feedback"] = isIncorrect ? "Incorrect" : "Correct";

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

    const feedbackList = csvData.map((row: any, index: number) => ({
      index,
      data: row,
      prediction: predictResult[index],
      feedback: incorrectPredictions.includes(index) ? "Incorrect" : "Correct",
    }));

    try {
      setIsSavingFeedback(true);
      await modelAPI.feedbackUpdate(s3_url, feedbackList);
      message.success("Feedback updated successfully");
    } catch (error: any) {
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
        Papa.parse(reader.result as string, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data, meta }: any) => {
            // Start with all CSV data columns
            const initialVisibleColumns = [...(meta.fields || [])];

            // Add prediction columns if available
            if (predictResult.length > 0) {
              initialVisibleColumns.push(
                getPredictedClassColumnName(),
                "Confidence",
              );
            }

            // Add Actions column
            initialVisibleColumns.push("Actions");
            const initialIncorrect: number[] = [];

            // Cập nhật lịch sử
            setPredictionHistory((prev: any) => {
              const existingIndex = prev.findIndex(
                (item: any) => item.fileName === uploadedFiles[0].name,
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
  const handleFileSelect = (index: number) => {
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
      accuracy: total ? (((total - incorrect) / total) * 100).toFixed(1) : "0",
      totalReviewed: reviewed,
    });
  }, [incorrectPredictions, csvData, currentPage]);

  const handlePredictionToggle = (index: number) => {
    setIncorrectPredictions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
    // Cập nhật predictionHistory
    setPredictionHistory((prev: any) => {
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

  const showRowDetails = (record: any, index: number) => {
    setSelectedRowData({ record, index });
    setInfoDrawerVisible(true);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploading(true);
      handleUploadFiles(files).finally(() => {
        setUploading(false);
      });
    }
  };

  const handleColumnVisibilityToggle = (column: string) => {
    setVisibleColumns((prev: string[]) =>
      prev.includes(column)
        ? prev.filter((col: string) => col !== column)
        : [...prev, column],
    );
    // Cập nhật predictionHistory
    setPredictionHistory((prev: any[]) => {
      const newHistory = [...prev];
      if (newHistory[currentFileIndex]) {
        newHistory[currentFileIndex].visibleColumns = visibleColumns.includes(
          column,
        )
          ? visibleColumns.filter((col: string) => col !== column)
          : [...visibleColumns, column];
      }
      return newHistory;
    });
  };

  const getFilteredData = () => {
    return csvData;
  };

  const renderTable = () => {
    if (!filteredData.length) return null;

    const columns = getColumns();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);
    const pageData = filteredData.slice(startIndex, endIndex);

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-50"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((record: any, index: number) => {
              const globalIndex = startIndex + index;
              const isIncorrect = incorrectPredictions.includes(globalIndex);
              return (
                <tr
                  key={index}
                  className={`border-b border-slate-200 dark:border-slate-700 ${
                    isIncorrect
                      ? "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-slate-700 dark:text-slate-300"
                    >
                      {col.render
                        ? col.render(null, record, index, globalIndex)
                        : record[col.dataIndex]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing {startIndex + 1} to {endIndex} of {filteredData.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(Math.ceil(filteredData.length / pageSize), p + 1),
                )
              }
              disabled={
                currentPage >= Math.ceil(filteredData.length / pageSize)
              }
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const getColumns = () => {
    if (!csvData.length) return [];
    const allColumns = Object.keys(csvData[0]);
    const targetColumn = projectInfo.target_column;

    const baseColumns = allColumns
      .filter((col: string) => visibleColumns.includes(col))
      .map((col: string) => ({
        title: col,
        dataIndex: col,
        key: col,
        render: (_: any, record: any, index: number, globalIndex: number) => {
          const text = record[col];
          const truncatedText = truncateText(text);
          const isTruncated = isTextTruncated(text);
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === col;

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 dark:bg-slate-700 dark:border-slate-600 h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <CircleX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          }

          if (col === targetColumn) {
            return (
              <div className="flex items-center justify-between gap-2 group">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="default"
                        className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 cursor-help"
                      >
                        {truncatedText}
                      </Badge>
                    </TooltipTrigger>
                    {isTruncated && <TooltipContent>{text}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
                {editMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditCell(index, col, text)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          }

          return (
            <div className="flex items-center justify-between gap-2 group">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={isTruncated ? "cursor-help" : ""}>
                      {truncatedText}
                    </span>
                  </TooltipTrigger>
                  {isTruncated && <TooltipContent>{text}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
              {editMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditCell(index, col, text)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        },
      }));

    // Add Predicted Class column if visible
    const predictedClassColumnName = getPredictedClassColumnName();
    if (visibleColumns.includes(predictedClassColumnName)) {
      baseColumns.push({
        title: predictedClassColumnName,
        key: "predictedClass",
        dataIndex: "predictedClass",
        render: (_: any, record: any, index: number, globalIndex: number) => {
          const prediction = predictResult[globalIndex];
          const predictedInfo = getPredictedInfo(prediction, globalIndex);
          const isCorrect = !incorrectPredictions.includes(globalIndex);
          const isEditing =
            editingCell?.rowIndex === index &&
            editingCell?.columnKey === "predictedClass";
          const displayValue =
            predictedInfo.class === null ? "-" : predictedInfo.class;

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 dark:bg-slate-700 dark:border-slate-600 h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-red-600 dark:text-red-400"
                  >
                    <CircleX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div className="flex items-center justify-between gap-2 group">
              <Badge
                variant="default"
                className={
                  isCorrect
                    ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                    : "bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200"
                }
              >
                {displayValue}
              </Badge>
              {editMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleEditCell(index, "predictedClass", displayValue)
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        },
      });
    }

    // Add Confidence column if visible
    if (visibleColumns.includes("Confidence")) {
      baseColumns.push({
        title: "Confidence",
        key: "confidence",
        dataIndex: "confidence",
        render: (_: any, record: any, index: number, globalIndex: number) => {
          const prediction = predictResult[globalIndex];
          const predictedInfo = getPredictedInfo(prediction, globalIndex);
          const isCorrect = !incorrectPredictions.includes(globalIndex);
          const isEditing =
            editingCell?.rowIndex === index &&
            editingCell?.columnKey === "confidence";
          const displayValue =
            predictedInfo.confidence === null ? "-" : predictedInfo.confidence;

          if (isEditing) {
            return (
              <div className="flex items-center gap-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 dark:bg-slate-700 dark:border-slate-600 h-8"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  onBlur={handleSaveEdit}
                />
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="text-red-600 dark:text-red-400"
                  >
                    <CircleX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          }

          return (
            <div className="flex items-center justify-between gap-2 group">
              <Badge
                variant="default"
                className={
                  isCorrect
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200"
                    : "bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200"
                }
              >
                {displayValue}
              </Badge>
              {editMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleEditCell(index, "confidence", displayValue)
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        },
      });
    }

    // Add Actions column if visible
    if (visibleColumns.includes("Actions")) {
      baseColumns.push({
        title: "Actions",
        key: "actions",
        dataIndex: "actions",
        render: (_: any, record: any, index: number, globalIndex: number) => {
          const isIncorrect = incorrectPredictions.includes(globalIndex);
          return (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isIncorrect ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => handlePredictionToggle(globalIndex)}
                      className="dark:border-slate-600"
                    >
                      {isIncorrect ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <CircleX className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline ml-1">
                        {isIncorrect ? "Correct" : "Incorrect"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Mark as {isIncorrect ? "correct" : "incorrect"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showRowDetails(record, globalIndex)}
                      className="dark:border-slate-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>View details</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      });
    }

    return baseColumns;
  };

  const columns = getColumns();
  const filteredData = getFilteredData();

  const [fileHistoryOpen, setFileHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      {/* Header Card */}
      <div className="mb-8">
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl text-slate-900 dark:text-slate-50">
                  Prediction Dashboard
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Review and validate your model predictions
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {/* File Selection */}
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFileHistoryOpen(!fileHistoryOpen)}
                          className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="hidden sm:inline ml-2 truncate max-w-[150px]">
                            {predictionHistory[currentFileIndex]?.fileName ||
                              "No file"}
                          </span>
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Select prediction file</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {fileHistoryOpen && (
                    <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                      {predictionHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleFileSelect(index);
                            setFileHistoryOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-slate-700 dark:text-slate-300"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{item.fileName}</span>
                          </span>
                          {index === currentFileIndex && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column Visibility */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInfoDrawerVisible(true)}
                        className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Columns</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Configure visible columns</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Download */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!csvData.length}
                        className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline ml-2">Download</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download as CSV</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Update Feedback */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleUpdateFeedback}
                        disabled={!csvData.length || isSavingFeedback}
                        className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50"
                      >
                        {isSavingFeedback ? (
                          <>
                            <Spinner className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">
                              Saving...
                            </span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">
                              Update feedback
                            </span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save feedback to server</TooltipContent>
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
      </div>

      {/* Main Content */}
      {loading ? (
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Spinner />
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
              Loading prediction data...
            </p>
          </CardContent>
        </Card>
      ) : csvData.length > 0 ? (
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="pb-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-900 dark:text-slate-50">
                Prediction Results
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={editMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setEditMode(!editMode);
                        if (editMode) {
                          handleCancelEdit();
                        }
                      }}
                      className={
                        editMode
                          ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                          : "dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      }
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">
                        {editMode ? "Exit Edit" : "Edit Mode"}
                      </span>
                    </Button>
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
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg rounded-xl">
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No prediction data available
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Upload a CSV file to start reviewing predictions
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={handleClick}
                disabled={uploading}
                className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
              >
                {uploading ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    <span className="ml-2">Uploading...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Upload a file to start
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={infoDrawerVisible} onOpenChange={setInfoDrawerVisible}>
        <DialogContent className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              {selectedRowData ? "Prediction Details" : "Column Visibility"}
            </DialogTitle>
          </DialogHeader>

          {selectedRowData ? (
            <div className="space-y-6 py-4">
              {/* Data Fields */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-blue-500 rounded-full" />
                  Data Fields
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedRowData.record).map(
                    ([key, value]: [string, unknown]) => (
                      <div
                        key={key}
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {key}
                        </p>
                        {key === projectInfo.target_column ? (
                          <Badge
                            variant="default"
                            className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200"
                          >
                            {value as React.ReactNode}
                          </Badge>
                        ) : (
                          <p className="text-sm text-slate-900 dark:text-slate-50">
                            {value as React.ReactNode}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Prediction */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-purple-500 rounded-full" />
                  Prediction
                </h4>
                <div className="space-y-2">
                  {(() => {
                    const prediction = predictResult[selectedRowData.index];
                    const predictedInfo = getPredictedInfo(
                      prediction,
                      selectedRowData.index,
                    );

                    return (
                      <>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            {getPredictedClassColumnName()}
                          </p>
                          <Badge
                            variant="default"
                            className="bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200"
                          >
                            {predictedInfo.class !== null
                              ? predictedInfo.class
                              : "No prediction"}
                          </Badge>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            Confidence
                          </p>
                          <Badge
                            variant="default"
                            className="bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200"
                          >
                            {predictedInfo.confidence !== null
                              ? predictedInfo.confidence
                              : "No prediction"}
                          </Badge>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant={
                    incorrectPredictions.includes(selectedRowData.index)
                      ? "outline"
                      : "destructive"
                  }
                  className="w-full dark:border-slate-600"
                  onClick={() => handlePredictionToggle(selectedRowData.index)}
                >
                  {incorrectPredictions.includes(selectedRowData.index) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Mark as Correct
                    </>
                  ) : (
                    <>
                      <CircleX className="w-4 h-4 mr-2" />
                      Mark as Incorrect
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select which columns to display in the table for better data
                visualization.
              </p>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  Available Columns
                </h4>
                <div className="space-y-2">
                  {/* CSV Data Columns */}
                  {csvData.length > 0 &&
                    Object.keys(csvData[0]).map((column) => (
                      <label
                        key={column}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column)}
                          onChange={() => handleColumnVisibilityToggle(column)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        />
                        <div>
                          <p
                            className={`text-sm ${
                              column === projectInfo.target_column
                                ? "font-semibold text-emerald-600 dark:text-emerald-400"
                                : "text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {column}
                          </p>
                          {column === projectInfo.target_column && (
                            <Badge
                              variant="default"
                              className="mt-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                            >
                              Target
                            </Badge>
                          )}
                        </div>
                      </label>
                    ))}

                  {/* Prediction Columns */}
                  {predictResult.length > 0 && (
                    <>
                      <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(
                            getPredictedClassColumnName(),
                          )}
                          onChange={() =>
                            handleColumnVisibilityToggle(
                              getPredictedClassColumnName(),
                            )
                          }
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        />
                        <div>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {getPredictedClassColumnName()}
                          </p>
                          <Badge
                            variant="default"
                            className="mt-1 bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200"
                          >
                            Prediction
                          </Badge>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes("Confidence")}
                          onChange={() =>
                            handleColumnVisibilityToggle("Confidence")
                          }
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                        />
                        <div>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            Confidence
                          </p>
                          <Badge
                            variant="default"
                            className="mt-1 bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200"
                          >
                            Score
                          </Badge>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="default"
                  onClick={() => setInfoDrawerVisible(false)}
                  className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TabularClassificationPredict;
