import React, {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Input } from "src/components/ui/input";
import { Badge } from "src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { Empty } from "src/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import Papa from "papaparse";

const MultilabelHistoryViewer = forwardRef(({ data }, ref) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allColumns, setAllColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [filterText, setFilterText] = useState("");

  const getPredictedLabels = (prediction) => {
    if (!prediction || !prediction.class || !prediction.label) {
      return [];
    }
    const binaryArray = prediction.class;
    const labels = prediction.label;
    return binaryArray
      .map((value, index) => (value === 1 ? labels[index] : null))
      .filter((label) => label !== null);
  };

  useImperativeHandle(ref, () => ({
    openDrawer() {
      setIsDrawerOpen(true);
    },
    downloadCsv() {
      downloadCsv();
    },
  }));

  const downloadCsv = () => {
    if (!data || data.length === 0) return;

    const dataToDownload = data.map((row) => {
      const downloadRow = {};
      visibleColumns.forEach((col) => {
        if (col === "Predicted Class") {
          downloadRow[col] = getPredictedLabels(row).join("; ");
        } else {
          downloadRow[col] = row[col];
        }
      });
      return downloadRow;
    });

    const csv = Papa.unparse(dataToDownload);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `multilabel_prediction_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (data && data.length > 0 && typeof data[0] === "object") {
      const keys = Object.keys(data[0]).filter(
        (key) =>
          key.toLowerCase() !== "key" &&
          key.toLowerCase() !== "class" &&
          key.toLowerCase() !== "label",
      );
      setAllColumns([...keys, "Predicted Class"]);
      setVisibleColumns([...keys, "Predicted Class"]);
    } else {
      setAllColumns([]);
      setVisibleColumns([]);
    }
  }, [data]);

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey],
    );
  };

  const truncateText = (text) => {
    if (typeof text !== "string" || !text) return text;
    return text.length > 50 ? text.substring(0, 50) + "..." : text;
  };

  const isTextTruncated = (text) => {
    return typeof text === "string" && text.length > 50;
  };

  if (!data || data.length === 0) {
    return <Empty />;
  }

  const displayData = data.map((row, idx) => ({
    ...row,
    _index: idx,
  }));

  const filteredDrawerColumns = allColumns.filter((col) =>
    col.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 dark:bg-white/5">
            <tr>
              {allColumns.map((column, index) => {
                if (!visibleColumns.includes(column)) return null;
                const isSpecial = column === "Predicted Class";
                return (
                  <th
                    key={column}
                    className={`border-b border-gray-200 p-3 text-left text-xs font-semibold text-gray-700 dark:border-white/10 dark:text-gray-300 ${
                      isSpecial
                        ? "sticky right-0 bg-gray-50 dark:bg-white/5"
                        : ""
                    }`}
                  >
                    {column}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayData.map((record) => (
              <tr
                key={record._index}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
              >
                {allColumns.map((column) => {
                  if (!visibleColumns.includes(column)) return null;
                  const isSpecial = column === "Predicted Class";

                  let content;
                  if (column === "Predicted Class") {
                    const predictedLabels = getPredictedLabels(record);
                    if (predictedLabels.length === 0) {
                      content = (
                        <Badge variant="secondary">No prediction</Badge>
                      );
                    } else {
                      content = (
                        <div className="flex flex-wrap gap-1">
                          {predictedLabels.map((label, idx) => (
                            <Badge
                              key={idx}
                              className="bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200"
                            >
                              {label}
                            </Badge>
                          ))}
                        </div>
                      );
                    }
                  } else {
                    const value = record[column];
                    const isTruncated = isTextTruncated(value);
                    content = (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            className={
                              isTruncated ? "cursor-help" : "cursor-default"
                            }
                          >
                            {truncateText(value)}
                          </TooltipTrigger>
                          {isTruncated && (
                            <TooltipContent>{value}</TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  }

                  return (
                    <td
                      key={column}
                      className={`border-b border-gray-200 p-3 text-gray-700 dark:border-white/10 dark:text-gray-300 ${
                        isSpecial
                          ? "sticky right-0 bg-white dark:bg-slate-950"
                          : ""
                      }`}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Column Settings</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search columns..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="mb-4"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredDrawerColumns.map((columnKey) => (
              <label
                key={columnKey}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(columnKey)}
                  onChange={() => handleColumnToggle(columnKey)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {columnKey}
                </span>
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

MultilabelHistoryViewer.displayName = "MultilabelHistoryViewer";
export default MultilabelHistoryViewer;
