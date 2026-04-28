import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { ResponsiveContainer } from "recharts";
import LineGraph from "@/src/features/project-build/components/training/LineGraph";

export function TrainResultPerformanceCharts({ valGraphs }) {
  return (
    <Card className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Training Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(valGraphs).map(([metricName, metricData]) => (
          <div key={metricName}>
            <ResponsiveContainer width="100%" height={300}>
              <LineGraph
                data={metricData}
                label={
                  <span className="text-gray-900 dark:text-white">
                    {metricName.replace("_", " ")} graph
                  </span>
                }
              />
            </ResponsiveContainer>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
