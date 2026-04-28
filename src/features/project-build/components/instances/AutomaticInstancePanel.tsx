import React from "react";
import { Clock } from "lucide-react";
import { Wrench } from "lucide-react";
import { InstanceMetricPill } from "./InstanceMetricPill";
import { InstanceSummarySidebar } from "./InstanceSummarySidebar";
import {
  INSTANCE_SIZE_DETAILS,
  InstanceSizeCard,
} from "src/constants/clouldInstance";

export function AutomaticInstancePanel({
  formData,
  setFormData,
  isProcessing,
  onStartTraining,
  handleTrainingTimeChange,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Training Duration Section */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Training Duration
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={24}
                step={0.5}
                value={formData.trainingTime || 0}
                onChange={(e) =>
                  handleTrainingTimeChange(Number(e.target.value))
                }
                className="flex-1 accent-blue-600"
              />
              <InstanceMetricPill
                value={formData.trainingTime || 0}
                suffix="hours"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recommended: 1-24 hours for most models
            </p>
          </div>
        </div>

        {/* Performance Level Section */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Performance Level
            </h2>
          </div>
          <div className="grid gap-4">
            {Object.entries(INSTANCE_SIZE_DETAILS).map(([size, details]) => (
              <InstanceSizeCard
                key={size}
                size={size}
                details={details}
                selected={formData.instanceSize === size}
                onClick={() => {
                  const defaultTrainingTimes = {
                    Weak: 2,
                    Medium: 4,
                    Strong: 6,
                    "Super Strong": 8,
                    Rocket: 12,
                  };

                  setFormData((prev) => ({
                    ...prev,
                    gpuNumber: details.instanceDetails.gpuNumber,
                    gpuName: details.instanceDetails.name,
                    disk: details.instanceDetails.disk,
                    cost: details.instanceDetails.cost,
                    instanceSize: size,
                    trainingTime:
                      defaultTrainingTimes[size] || prev.trainingTime,
                    budget: (
                      details.instanceDetails.cost *
                      (defaultTrainingTimes[size] || prev.trainingTime)
                    ).toFixed(2),
                  }));
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="lg:col-span-1">
        <InstanceSummarySidebar
          formData={formData}
          isProcessing={isProcessing}
          onStartTraining={onStartTraining}
        />
      </div>
    </div>
  );
}
