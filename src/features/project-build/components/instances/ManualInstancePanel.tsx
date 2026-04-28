import React from "react";
import { Clock } from "lucide-react";
import { InstanceMetricPill } from "./InstanceMetricPill";
import { InstanceSummarySidebar } from "./InstanceSummarySidebar";
import { SERVICES, GPU_LEVELS } from "src/constants/clouldInstance";

export function ManualInstancePanel({
  formData,
  handleTrainingTimeChange,
  handleManualConfigChange,
  handleGpuNumberChange,
  handleDiskChange,
  isProcessing,
  onStartTraining,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Training Duration Section */}
        <div className="rounded-2xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-slate-900 p-6">
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

        {/* Manual Configuration Section */}
        <div className="rounded-2xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Manual Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Service Provider
              </label>
              <select
                value={formData.service}
                onChange={(e) =>
                  handleManualConfigChange("service")(e.target.value)
                }
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              >
                {SERVICES.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name} - {service.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                GPU Type
              </label>
              <select
                value={formData.gpuName}
                onChange={(e) =>
                  handleManualConfigChange("gpuName")(e.target.value)
                }
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              >
                {GPU_LEVELS.map((gpu) => (
                  <option key={gpu.name} value={gpu.name}>
                    {gpu.name} ({gpu.memory})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Number of GPUs
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={formData.gpuNumber}
                  onChange={(e) =>
                    handleGpuNumberChange(Number(e.target.value))
                  }
                  className="flex-1 accent-blue-600"
                />
                <InstanceMetricPill value={formData.gpuNumber} suffix="GPUs" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Disk Space
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={formData.disk}
                  onChange={(e) => handleDiskChange(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <InstanceMetricPill value={formData.disk} suffix="GB" />
              </div>
            </div>
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
