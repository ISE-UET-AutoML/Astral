import React from "react";
import { Spinner as UiSpinner } from "src/components/ui/spinner";
import { ChartLine as LineChartOutlined } from "lucide-react";
const cx = (...classes) => classes.filter(Boolean).join(" ");
const Spin = ({ tip, children, className = "", ...props }) => (
  <div className={cx("inline-flex items-center gap-2", className)} {...props}>
    <UiSpinner />
    {tip && <span>{tip}</span>}
    {children}
  </div>
);
const Typography = {
  Title: ({ level = 3, children, className = "", ...props }) => {
    const Heading = `h${level}`;
    return (
      <Heading className={cx("font-semibold", className)} {...props}>
        {children}
      </Heading>
    );
  },
  Text: ({ children, className = "", ...props }) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  Paragraph: ({ children, className = "", ...props }) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
};
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const { Text } = Typography;

export function EnhancedLineGraph({
  valMetric,
  data,
  loading,
  maxTrainingTime,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Spin size="large" tip="Loading chart data..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 w-full border border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-800">
        <div className="flex flex-col items-center gap-2">
          <LineChartOutlined className="text-5xl text-gray-400 dark:text-gray-500" />
          <Text type="secondary" className="text-gray-500 dark:text-gray-400">
            Waiting for training data...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="step"
          label={{
            value: "Epoch (Step)",
            position: "insideBottomRight",
            offset: -5,
            style: {
              fill: "#6b7280",
            },
          }}
          tick={{
            fontSize: 12,
            fill: "#6b7280",
          }}
          domain={[0, "auto"]}
        />
        <YAxis
          label={{
            value: valMetric,
            angle: -90,
            position: "insideLeft",
            style: {
              fill: "#6b7280",
            },
          }}
          domain={[0, "auto"]}
          tick={{
            fontSize: 12,
            fill: "#6b7280",
          }}
        />
        <RechartsTooltip
          formatter={(value) => [`${(value * 1).toFixed(2)}`, valMetric]}
          labelFormatter={(label) => `Epoch: ${label} step`}
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            borderRadius: "8px",
            border: "1px solid #4b5563",
            color: "#e2e8f0",
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#60a5fa"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorAccuracy)"
          activeDot={{
            r: 8,
            stroke: "#60a5fa",
            strokeWidth: 2,
            fill: "#0f172a",
          }}
          name={`Validation ${valMetric}`}
        />
        {maxTrainingTime && (
          <Line
            type="monotone"
            dataKey="threshold"
            stroke="transparent"
            strokeWidth={0}
            name="Max Training Time"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
