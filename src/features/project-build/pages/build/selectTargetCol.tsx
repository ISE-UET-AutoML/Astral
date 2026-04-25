import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import * as datasetAPI from "src/features/datasets/api/dataset";
import * as projectAPI from "src/features/projects/api/project";
import { Button } from "src/components/ui/button";
import { Spinner } from "src/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { toast } from "sonner";
import { Check, Info, Table2, Target } from "lucide-react";

const SelectTargetCol = () => {
  const { projectInfo, selectedDataset, updateFields } = useOutletContext();
  const navigate = useNavigate();
  const [dataset, setDataset] = useState(null);
  const [colsName, setColsName] = useState([]);
  const [selectedCol, setSelectedCol] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id: projectID } = useParams();

  useEffect(() => {
    if (!selectedDataset?._id) return;

    const fetchDataset = async () => {
      setLoading(true);
      try {
        const { data } = await datasetAPI.getDatasetPreview(
          selectedDataset._id,
          10,
        );

        // Xử lý dữ liệu để đảm bảo cấu trúc nhất quán
        const processedData = data.files.map((row) => {
          // Chuyển đổi các giá trị undefined/null thành chuỗi rỗng
          return Object.entries(row).reduce((acc, [key, value]) => {
            acc[key] = value ?? "";
            return acc;
          }, {});
        });

        setDataset(processedData);

        // Lấy tất cả các key có thể có từ tất cả các hàng
        const allKeys = [...new Set(processedData.flatMap(Object.keys))];
        setColsName(allKeys);
      } catch (error) {
        console.error("Error fetching dataset:", error);
        toast.error("Failed to load dataset preview");
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [selectedDataset?._id]);

  // Xác định loại dữ liệu của cột
  const getColumnType = (value) => {
    if (value === undefined || value === null || value === "") return "unknown";
    if (typeof value === "number") return "number";
    if (!isNaN(Number(value))) return "number";
    return "text";
  };

  // Hàm gửi thông tin cột mục tiêu và cột văn bản
  const sendTargetColumn = async () => {
    if (!selectedCol) {
      toast.warning("Please select a target column");
      return;
    }

    // Các cột còn lại sẽ được xếp vào textCols
    const textCols = colsName.filter((col) => col !== selectedCol);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("targetCol", selectedCol);
      formData.append("textCols", textCols);
      formData.append("datasetID", selectedDataset?._id);

      const res = await projectAPI.sendTargetColumn(projectID, formData);

      if (res.status === 200) {
        toast.success("Target Column Set Successfully");
        navigate(`/app/project/${projectInfo._id}/build/selectInstance`);
      }
    } catch (error) {
      console.error("Error sending target column:", error);
      toast.error("Failed to set target column");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[var(--surface)] px-4 py-6 font-poppins sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[var(--title-project)] md:text-4xl">
            Select target column
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-[var(--secondary-text)] md:text-base">
            Choose the label column for training. Every other column will be
            sent as input text for the model.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[var(--border)] dark:bg-[var(--card-gradient)]">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                <Target className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-[var(--text)]">
                    Target column
                  </h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 cursor-help text-slate-400 dark:text-[var(--secondary-text)]" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Select the column that contains the expected output for
                        each row.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-[var(--secondary-text)]">
                  Pick exactly one column. The preview below highlights your
                  selection.
                </p>
              </div>
            </div>

            <select
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-[var(--border)] dark:bg-[var(--input-bg)] dark:text-[var(--text)] dark:focus:border-[var(--input-focus-border)]"
              value={selectedCol || ""}
              onChange={(event) => setSelectedCol(event.target.value || null)}
              disabled={loading || colsName.length === 0}
            >
              <option value="">Select target column</option>
              {colsName.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>

            <div className="mt-5 flex justify-end">
              <Button
                size="lg"
                onClick={sendTargetColumn}
                disabled={!selectedCol || loading}
                className="min-w-44 bg-blue-600 text-white hover:bg-blue-700"
              >
                {loading ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Confirm selection
              </Button>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-[var(--border)] dark:bg-[var(--hover-bg)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-[var(--text)]">
                <Table2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-[var(--text)]">
                  Dataset preview
                </h2>
                <p className="text-sm text-slate-500 dark:text-[var(--secondary-text)]">
                  {dataset?.length || 0} rows loaded, {colsName.length} columns
                </p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-[var(--secondary-text)]">
                  Selected
                </dt>
                <dd className="max-w-[12rem] truncate font-semibold text-slate-900 dark:text-[var(--text)]">
                  {selectedCol || "None"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500 dark:text-[var(--secondary-text)]">
                  Input columns
                </dt>
                <dd className="font-semibold text-slate-900 dark:text-[var(--text)]">
                  {selectedCol
                    ? Math.max(colsName.length - 1, 0)
                    : colsName.length}
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[var(--border)] dark:bg-[var(--card-gradient)]">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-[var(--border)]">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-[var(--text)]">
                Preview rows
              </h2>
              <p className="text-sm text-slate-500 dark:text-[var(--secondary-text)]">
                The selected target column is highlighted.
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[var(--secondary-text)]">
                <Spinner />
                Loading
              </div>
            )}
          </div>

          {dataset ? (
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[var(--surface)]">
                  <tr>
                    {colsName.map((col) => {
                      const selected = col === selectedCol;
                      return (
                        <th
                          key={col}
                          className={`whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold dark:border-[var(--border)] ${
                            selected
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200"
                              : "text-slate-700 dark:text-[var(--text)]"
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span>{col}</span>
                            <span className="text-[11px] font-normal text-slate-400 dark:text-[var(--secondary-text)]">
                              {dataset[0]
                                ? getColumnType(dataset[0][col])
                                : "unknown"}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {dataset.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-[var(--border)] dark:hover:bg-white/5"
                    >
                      {colsName.map((col) => {
                        const selected = col === selectedCol;
                        return (
                          <td
                            key={col}
                            className={`max-w-[220px] truncate px-4 py-3 dark:text-[var(--text)] ${
                              selected
                                ? "bg-blue-50/70 font-semibold text-blue-800 dark:bg-blue-500/15 dark:text-blue-100"
                                : "text-slate-700"
                            }`}
                            title={String(row[col] ?? "")}
                          >
                            {String(row[col] ?? "")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center px-5 py-10 text-sm text-slate-500 dark:text-[var(--secondary-text)]">
              {loading
                ? "Loading dataset preview..."
                : "No dataset preview available."}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SelectTargetCol;
