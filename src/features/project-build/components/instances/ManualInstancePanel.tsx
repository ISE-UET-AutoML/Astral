import { Clock, SlidersHorizontal } from "lucide-react";
import { InstanceMetricPill } from "./InstanceMetricPill";
import { InstanceSummarySidebar } from "./InstanceSummarySidebar";
import { SERVICES, GPU_LEVELS } from "src/constants/clouldInstance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";

const panelClass =
  "rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900";
const labelClass =
  "mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400";
const selectItemClass =
  "h-8 rounded-lg px-2.5 pr-8 text-sm text-gray-700 focus:bg-blue-50 focus:text-blue-700 dark:text-gray-200 dark:focus:bg-blue-500/15 dark:focus:text-blue-100";

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Training Duration */}
        <div className={panelClass}>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="size-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Training Duration
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={24}
                step={0.5}
                value={formData.trainingTime || 0}
                onChange={(e) => handleTrainingTimeChange(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <InstanceMetricPill value={formData.trainingTime || 0} suffix="hours" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: 1–24 hours for most models
            </p>
          </div>
        </div>

        {/* Manual Configuration */}
        <div className={panelClass}>
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Manual Configuration
            </h2>
          </div>
          <div className="space-y-4">
            {/* Service Provider */}
            <div>
              <label className={labelClass}>Service Provider</label>
              <Select
                value={formData.service}
                onValueChange={handleManualConfigChange("service")}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-sm dark:border-white/10 dark:bg-slate-800">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 dark:border-white/10 dark:bg-slate-950">
                  {SERVICES.map((service) => (
                    <SelectItem
                      key={service.name}
                      value={service.name}
                      className={selectItemClass}
                    >
                      {service.name} — {service.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GPU Type */}
            <div>
              <label className={labelClass}>GPU Type</label>
              <Select
                value={formData.gpuName}
                onValueChange={handleManualConfigChange("gpuName")}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border-gray-200 bg-white text-sm dark:border-white/10 dark:bg-slate-800">
                  <SelectValue placeholder="Select GPU" />
                </SelectTrigger>
                <SelectContent className="z-[1100] rounded-xl border border-gray-200 bg-white p-1.5 dark:border-white/10 dark:bg-slate-950">
                  {GPU_LEVELS.map((gpu) => (
                    <SelectItem
                      key={gpu.name}
                      value={gpu.name}
                      className={selectItemClass}
                    >
                      {gpu.name} ({gpu.memory})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Number of GPUs */}
            <div>
              <label className={labelClass}>Number of GPUs</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={formData.gpuNumber}
                  onChange={(e) => handleGpuNumberChange(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <InstanceMetricPill value={formData.gpuNumber} suffix="GPUs" />
              </div>
            </div>

            {/* Disk Space */}
            <div>
              <label className={labelClass}>Disk Space</label>
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
