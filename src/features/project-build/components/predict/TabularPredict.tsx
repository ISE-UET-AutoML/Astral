import { useState, useEffect, useRef } from "react";
import * as modelAPI from "src/features/models/api/model";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
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
  Upload,
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

const TabularPredict = ({
  predictResult,
  uploadedFiles,
  projectInfo,
  handleUploadFiles,
  s3_url,
}: {
  predictResult: any[];
  uploadedFiles: any[];
  projectInfo: any;
  handleUploadFiles: (files: FileList) => Promise<void>;
  s3_url: string;
}) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
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
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [uploading, setUploading] = useState<boolean>(false);
  const [isSavingFeedback, setIsSavingFeedback] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageSize = 9;

  useEffect(() => {
    if (uploadedFiles?.length && uploadedFiles[0]?.name.endsWith(".csv")) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        Papa.parse(reader.result as string, {
          header: true,
          skipEmptyLines: true,
          complete: ({ data, meta }: any) => {
            const importantColumns = [
              projectInfo.target_column,
              "Predicted Class",
              "Confidence",
              "Actions",
            ];
            const initialVisibleColumns = (meta.fields || []).filter(
              (field: string) =>
                importantColumns.includes(field) ||
                (meta.fields || []).indexOf(field) < 3,
            );
            const initialIncorrect = predictResult
              .map((result: any, idx: number) =>
                result.confidence < 0.7 ? idx : null,
              )
              .filter((idx: any) => idx !== null);

            setPredictionHistory((prev: any[]) => {
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
                newHistory = [...prev];
                newHistory[existingIndex] = newHistoryItem;
              } else {
                newHistory = [...prev, newHistoryItem];
              }

              setCurrentFileIndex(
                existingIndex >= 0 ? existingIndex : newHistory.length - 1,
              );

              return newHistory;
            });

            setCsvData(data);
            setVisibleColumns(initialVisibleColumns);
            setIncorrectPredictions(initialIncorrect);
            setCurrentPage(1);
            setConfidenceFilter("all");
            setLoading(false);
          },
        });
      };
      reader.readAsText(uploadedFiles[0]);
    }
  }, [uploadedFiles, predictResult, projectInfo]);

  const handleFileSelect = (index: number) => {
    if (index >= 0 && index < predictionHistory.length) {
      const selectedItem = predictionHistory[index];
      setCurrentFileIndex(index);
      setCsvData(selectedItem.data);
      setVisibleColumns(selectedItem.visibleColumns);
      setIncorrectPredictions(selectedItem.incorrectPredictions);
      setCurrentPage(1);
      setConfidenceFilter("all");
      setLoading(false);
    }
  };

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
    setIncorrectPredictions((prev: number[]) =>
      prev.includes(index)
        ? prev.filter((i: number) => i !== index)
        : [...prev, index],
    );
    setPredictionHistory((prev: any[]) => {
      const newHistory = [...prev];
      if (newHistory[currentFileIndex]) {
        newHistory[currentFileIndex].incorrectPredictions =
          incorrectPredictions.includes(index)
            ? incorrectPredictions.filter((i: number) => i !== index)
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

  const getFilteredData = () => {
    if (confidenceFilter === "all") return csvData;
    return csvData.filter((_, index: number) => {
      const confidence = predictResult[index]?.confidence || 0;
      if (confidenceFilter === "high") return confidence >= 0.8;
      if (confidenceFilter === "medium")
        return confidence >= 0.5 && confidence < 0.8;
      if (confidenceFilter === "low") return confidence < 0.5;
      return true;
    });
  };

  const getColumns = () => {
    if (!csvData.length) return [];
    const allColumns = Object.keys(csvData[0]);
    const targetColumn = projectInfo.target_column;

    return allColumns
      .filter((col: string) => visibleColumns.includes(col))
      .map((col: string) => ({
        title: col,
        dataIndex: col,
        key: col,
        render: (text: any) =>
          col === targetColumn ? (
            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200">
              {text}
            </Badge>
          ) : (
            <span className="text-slate-900 dark:text-slate-50">{text}</span>
          ),
      }));
  };

  const columns = getColumns();
  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      {/* Header Card */}
      <Card className="mb-6 shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-50">
            Prediction Review Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex items-center gap-2">
                <select
                  value={currentFileIndex}
                  onChange={(e) => handleFileSelect(parseInt(e.target.value))}
                  disabled={predictionHistory.length === 0}
                  className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-50 cursor-pointer"
                >
                  <option value="-1">No file uploaded</option>
                  {predictionHistory.map((item: any, index: number) => (
                    <option key={index} value={index}>
                      {item.fileName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <select
                      value={confidenceFilter}
                      onChange={(e) => setConfidenceFilter(e.target.value)}
                      className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-slate-50 cursor-pointer"
                    >
                      <option value="all">All predictions</option>
                      <option value="high">High confidence</option>
                      <option value="medium">Medium confidence</option>
                      <option value="low">Low confidence</option>
                    </select>
                  </TooltipTrigger>
                  <TooltipContent>Filter by confidence</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInfoDrawerVisible(true)}
                      className="dark:border-slate-700 dark:text-slate-300"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Columns
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Configure visible columns</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUpdateFeedback}
                      disabled={!csvData.length || isSavingFeedback}
                      className="dark:border-slate-700 dark:text-slate-300"
                    >
                      {isSavingFeedback ? (
                        <Spinner className="w-4 h-4 mr-2" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Update feedback
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Update feedback status</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleClick}
                      disabled={uploading}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      {uploading ? (
                        <Spinner className="w-4 h-4 mr-2" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload File
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Upload new file for prediction
                  </TooltipContent>
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
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="mb-6 shadow-sm bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Total Predictions
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {csvData.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Correct Predictions
              </p>
              <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {statistics.correct}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Incorrect Predictions
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {statistics.incorrect}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Accuracy
              </p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {statistics.accuracy}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Card */}
      {loading ? (
        <Card className="shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Spinner className="w-5 h-5" />
              <p className="text-slate-600 dark:text-slate-400">
                Loading prediction data...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : csvData.length > 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-0">
            {/* Native Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    {columns.map((col: any) => (
                      <th
                        key={col.key}
                        className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-50"
                      >
                        {col.title}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-50">
                      Predicted Class
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-50">
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-50">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((record: any, index: number) => {
                      const globalIndex = index + (currentPage - 1) * pageSize;
                      const isIncorrect =
                        incorrectPredictions.includes(globalIndex);
                      const confidence =
                        predictResult[globalIndex]?.confidence || 0;
                      const predicted = predictResult[globalIndex]?.class;

                      return (
                        <tr
                          key={index}
                          className={`border-b border-slate-200 dark:border-slate-700 ${
                            isIncorrect
                              ? "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          {columns.map((col: any) => (
                            <td
                              key={col.key}
                              className="px-4 py-3 text-slate-700 dark:text-slate-300"
                            >
                              {col.render
                                ? col.render(record[col.dataIndex])
                                : record[col.dataIndex]}
                            </td>
                          ))}
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            <Badge
                              className={
                                isIncorrect
                                  ? "bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200"
                                  : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                              }
                            >
                              {predicted || "-"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-12 h-2 rounded-full ${
                                  confidence >= 0.7
                                    ? "bg-emerald-500"
                                    : confidence >= 0.5
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                }`}
                                style={{
                                  width: `${confidence * 100}%`,
                                }}
                              />
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {(confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant={
                                        isIncorrect ? "outline" : "destructive"
                                      }
                                      size="sm"
                                      onClick={() =>
                                        handlePredictionToggle(globalIndex)
                                      }
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
                                    Mark as{" "}
                                    {isIncorrect ? "correct" : "incorrect"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        showRowDetails(record, globalIndex)
                                      }
                                      className="dark:border-slate-600"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View details</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * pageSize + 1,
                  filteredData.length,
                )}{" "}
                to {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
                {filteredData.length}
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
                      Math.min(
                        Math.ceil(filteredData.length / pageSize),
                        p + 1,
                      ),
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
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No prediction data available
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Upload a CSV file to start reviewing predictions
            </p>
            <Button
              onClick={handleClick}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {uploading ? (
                <Spinner className="w-4 h-4 mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload CSV File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Details/Column Visibility Dialog */}
      <Dialog open={infoDrawerVisible} onOpenChange={setInfoDrawerVisible}>
        <DialogContent className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">
              {selectedRowData ? "Prediction Details" : "Column Visibility"}
            </DialogTitle>
          </DialogHeader>

          {selectedRowData ? (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Confidence Score
                </p>
                <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  {(
                    predictResult[selectedRowData.index]?.confidence * 100
                  ).toFixed(1)}
                  %
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Data Fields
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedRowData.record).map(
                    ([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          {key}
                        </p>
                        {key === projectInfo.target_column ? (
                          <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200">
                            {value}
                          </Badge>
                        ) : (
                          <p className="text-sm text-slate-900 dark:text-slate-50">
                            {value}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Prediction
                </h4>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Predicted {projectInfo.target_column}
                  </p>
                  <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200">
                    {predictResult[selectedRowData.index]?.class}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant={
                    incorrectPredictions.includes(selectedRowData.index)
                      ? "outline"
                      : "destructive"
                  }
                  onClick={() => handlePredictionToggle(selectedRowData.index)}
                  className="flex-1 dark:border-slate-600"
                >
                  {incorrectPredictions.includes(selectedRowData.index) ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <CircleX className="w-4 h-4 mr-2" />
                  )}
                  Mark as{" "}
                  {incorrectPredictions.includes(selectedRowData.index)
                    ? "Correct"
                    : "Incorrect"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select which columns to display in the table.
              </p>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Available Columns
                </h4>
                <div className="space-y-2">
                  {csvData.length > 0 &&
                    Object.keys(csvData[0]).map((column: string) => (
                      <div
                        key={column}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(column)}
                          onChange={() => handleColumnVisibilityToggle(column)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600"
                        />
                        <span
                          className={`text-sm ${
                            column === projectInfo.target_column
                              ? "font-semibold text-blue-600 dark:text-blue-400"
                              : "text-slate-900 dark:text-slate-50"
                          }`}
                        >
                          {column}
                        </span>
                        {column === projectInfo.target_column && (
                          <Badge className="ml-auto bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 text-xs">
                            Target
                          </Badge>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <DialogFooter className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <Button
                  onClick={() => setInfoDrawerVisible(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Apply Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TabularPredict;
