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
import { X } from "lucide-react";

const TextHistoryViewer = forwardRef(({ data }, ref) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [allColumns, setAllColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [filterText, setFilterText] = useState("");

  useImperativeHandle(ref, () => ({
    openDrawer() {
      setIsDrawerOpen(true);
    },
    downloadCsv() {
      downloadCsv();
    },
  }));

  useEffect(() => {
    if (data && data.length > 0 && typeof data[0] === "object") {
      const keys = Object.keys(data[0]).filter(
        (key) => key.toLowerCase() !== "key",
      );
      setAllColumns(keys);
      setVisibleColumns(keys);
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

  const downloadCsv = () => {
    if (!data || data.length === 0) return;

    const dataToDownload = data.map((row) => {
      const downloadRow = {};
      visibleColumns.forEach((col) => {
        downloadRow[col] = row[col];
      });
      return downloadRow;
    });

    const csv = Papa.unparse(dataToDownload);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tabular_prediction_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const specialColumns = ["class", "prediction", "confidence", "probability"];

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
                const isSpecial = specialColumns.includes(column.toLowerCase());
                return (
                  <th
                    key={column.key || column || index}
                    className={`border-b border-gray-200 p-3 text-left text-xs font-semibold text-gray-700 dark:border-white/10 dark:text-gray-300 ${
                      isSpecial
                        ? "sticky right-0 bg-gray-50 dark:bg-white/5"
                        : ""
                    }`}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayData.map((record, rowIndex) => (
              <tr
                key={record._index}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
              >
                {allColumns.map((column, colIndex) => {
                  if (!visibleColumns.includes(column)) return null;
                  const value = record[column];
                  const isSpecial = specialColumns.includes(
                    column.toLowerCase(),
                  );

                  let content;
                  if (
                    column.toLowerCase() === "class" ||
                    column.toLowerCase() === "prediction"
                  ) {
                    const isPositive = String(value)
                      .toLowerCase()
                      .includes("positive");
                    content = (
                      <Badge
                        className={
                          isPositive
                            ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                            : "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200"
                        }
                      >
                        {String(value).toUpperCase()}
                      </Badge>
                    );
                  } else if (
                    column.toLowerCase() === "confidence" ||
                    column.toLowerCase() === "probability"
                  ) {
                    const num = parseFloat(value);
                    content = !isNaN(num)
                      ? `${(num * 100).toFixed(2)}%`
                      : value;
                  } else {
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

TextHistoryViewer.displayName = "TextHistoryViewer";
export default TextHistoryViewer;
