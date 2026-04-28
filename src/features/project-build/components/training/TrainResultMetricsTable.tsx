import React from "react";
import { Card } from "src/components/ui/card";
import { Table } from "src/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { Badge as Tag } from "src/components/ui/badge";
import { Info as InfoCircleOutlined } from "lucide-react";

const getAccuracyStatus = (score) => {
  if (score >= 0.9) {
    return (
      <Tag className="border-none bg-emerald-500 text-white">Excellent</Tag>
    );
  }
  if (score >= 0.7) {
    return <Tag className="border-none bg-blue-500 text-white">Good</Tag>;
  }
  if (score >= 0.6) {
    return <Tag className="border-none bg-amber-500 text-white">Medium</Tag>;
  }
  return <Tag className="border-none bg-red-500 text-white">Bad</Tag>;
};

const columns = [
  {
    title: "Metric",
    dataIndex: "metric",
    key: "metric",
    render: (text, record) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center">
              <span className="text-gray-900 dark:text-gray-100">{text}</span>{" "}
              <InfoCircleOutlined className="ml-1 text-blue-500 dark:text-blue-400" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{record.description}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    render: (text) => {
      const isNumeric = typeof text === "number" || isFinite(Number(text));
      const value = isNumeric ? Number(text).toFixed(2) : text;
      return <span className="text-gray-700 dark:text-gray-300">{value}</span>;
    },
  },
  {
    title: "Status",
    dataIndex: "value",
    key: "status",
    render: (score) => getAccuracyStatus(Number(score)),
  },
];

export function TrainResultMetricsTable({ metrics }) {
  return (
    <Card
      title={
        <span className="text-gray-900 dark:text-gray-100">
          Comprehensive Metrics
        </span>
      }
      className="theme-table rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900"
    >
      <Table
        columns={columns}
        dataSource={metrics}
        pagination={false}
        className="bg-transparent"
        rowKey={(record) => record.key || record.metric}
      />
    </Card>
  );
}
