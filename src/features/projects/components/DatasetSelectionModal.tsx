import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Button } from "src/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { AlertCircle } from "lucide-react";

const getCellValue = (record, dataIndex) =>
  Array.isArray(dataIndex)
    ? dataIndex.reduce((value, key) => value?.[key], record)
    : record?.[dataIndex];

const Table = ({
  columns = [],
  dataSource = [],
  rowKey = "id",
  rowSelection,
  className = "",
}) => (
  <div className={`w-full overflow-x-auto ${className}`}>
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {rowSelection && (
            <th className="border-b border-gray-200 dark:border-white/10 p-3 text-left" />
          )}
          {columns.map((column, index) => (
            <th
              key={column.key || column.dataIndex || index}
              className="border-b border-gray-200 dark:border-white/10 p-3 text-left font-semibold text-gray-900 dark:text-white"
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((record, rowIndex) => {
          const key =
            typeof rowKey === "function"
              ? rowKey(record)
              : (record?.[rowKey] ?? rowIndex);
          return (
            <tr
              key={key}
              className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              {rowSelection && (
                <td className="border-b border-gray-200 dark:border-white/10 p-3">
                  <input
                    type={rowSelection.type === "radio" ? "radio" : "checkbox"}
                    checked={rowSelection.selectedRowKeys?.includes(key)}
                    onChange={() => rowSelection.onChange?.([key], [record])}
                    className="rounded"
                  />
                </td>
              )}
              {columns.map((column, colIndex) => {
                const value = getCellValue(record, column.dataIndex);
                return (
                  <td
                    key={column.key || column.dataIndex || colIndex}
                    className="border-b border-gray-200 dark:border-white/10 p-3 text-gray-700 dark:text-gray-300"
                  >
                    {column.render
                      ? column.render(value, record, rowIndex)
                      : value}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const DatasetSelectionModal = ({
  open,
  onCancel,
  onConfirm,
  datasets,
  selectedDataset,
  onSelectDataset,
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Dataset</DialogTitle>
          <DialogDescription>
            Choose the dataset you want to use for training your AI model
          </DialogDescription>
        </DialogHeader>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Choose a Dataset</AlertTitle>
          <AlertDescription>
            Select the dataset that matches your chosen project type for best
            results.
          </AlertDescription>
        </Alert>

        <div className="max-h-[400px] overflow-y-auto mb-6">
          <Table
            dataSource={datasets}
            rowKey={(record) => record.id}
            columns={[
              {
                title: "Title",
                dataIndex: "title",
                key: "title",
              },
              {
                title: "Service",
                dataIndex: "service",
                key: "service",
              },
              {
                title: "Bucket",
                dataIndex: "bucketName",
                key: "bucket",
              },
            ]}
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedDataset ? [selectedDataset] : [],
              onChange: (selectedRowKey) => {
                onSelectDataset(selectedRowKey[0]);
              },
            }}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={!selectedDataset} onClick={onConfirm}>
            Use Selected Dataset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DatasetSelectionModal;
