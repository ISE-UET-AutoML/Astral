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
      <Tag className="border-none bg-gradient-to-br from-[#10b981] to-[#34d399] font-poppins text-white">
        Excellent
      </Tag>
    );
  }
  if (score >= 0.7) {
    return (
      <Tag className="border-none bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] font-poppins text-white">
        Good
      </Tag>
    );
  }
  if (score >= 0.6) {
    return (
      <Tag className="border-none bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] font-poppins text-white">
        Medium
      </Tag>
    );
  }
  return (
    <Tag className="border-none bg-gradient-to-br from-[#ef4444] to-[#f87171] font-poppins text-white">
      Bad
    </Tag>
  );
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
              <span className="font-poppins text-gray-900 dark:text-[#e2e8f0]">
                {text}
              </span>{" "}
              <InfoCircleOutlined className="ml-1 text-[#60a5fa]" />
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
      return (
        <span className="font-poppins text-gray-700 dark:text-slate-200">
          {value}
        </span>
      );
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
        <span className="font-poppins text-gray-900 dark:text-[#e2e8f0]">
          Comprehensive Metrics
        </span>
      }
      className="theme-table rounded-xl border border-[var(--border)] [background:var(--card-gradient)] shadow-lg backdrop-blur-md"
    >
      <Table
        columns={columns}
        dataSource={metrics}
        pagination={false}
        className="bg-transparent font-poppins"
        rowKey={(record) => record.key || record.metric}
      />
    </Card>
  );
}
