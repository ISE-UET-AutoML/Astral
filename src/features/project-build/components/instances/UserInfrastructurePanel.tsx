import { Clock, Building2, Copy } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { InstanceMetricPill } from "./InstanceMetricPill";
import { InstanceSummarySidebar } from "./InstanceSummarySidebar";

const panelClass =
  "rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900";
const labelClass =
  "mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400";
const inputClass =
  "h-10 rounded-xl border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus-visible:border-blue-400 focus-visible:ring-blue-500/30 dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-gray-500";

export function UserInfrastructurePanel({
  formData,
  handleTrainingTimeChange,
  sshKey,
  onCopySshKey,
  infrastructureData,
  handleInfrastructureChange,
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Recommended: 1–24 hours for most models
            </p>
          </div>
        </div>

        {/* Infrastructure Configuration */}
        <div className={panelClass}>
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="size-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Your Infrastructure
            </h2>
          </div>
          <div className="space-y-4">
            {/* SSH Key */}
            <div>
              <label className={labelClass}>SSH Public Key</label>
              <textarea
                value={sshKey}
                readOnly
                rows={2}
                className="min-h-20 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={onCopySshKey}
                className="mt-2 gap-1.5 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              >
                <Copy className="size-3.5" />
                Copy
              </Button>
            </div>

            {/* Instance ID */}
            <div>
              <label className={labelClass}>Instance ID</label>
              <Input
                type="text"
                value={infrastructureData.id}
                onChange={(e) =>
                  handleInfrastructureChange("id")(e.target.value)
                }
                placeholder="Enter instance ID"
                className={inputClass}
              />
            </div>

            {/* SSH Port */}
            <div>
              <label className={labelClass}>SSH Port</label>
              <Input
                type="number"
                value={infrastructureData.sshPort}
                onChange={(e) =>
                  handleInfrastructureChange("sshPort")(e.target.value)
                }
                min={1}
                max={65535}
                placeholder="Enter SSH port"
                className={inputClass}
              />
            </div>

            {/* Public IP */}
            <div>
              <label className={labelClass}>Public IP</label>
              <Input
                type="text"
                value={infrastructureData.publicIP}
                onChange={(e) =>
                  handleInfrastructureChange("publicIP")(e.target.value)
                }
                placeholder="Enter public IP"
                className={inputClass}
              />
            </div>

            {/* Deploy Port */}
            <div>
              <label className={labelClass}>Deploy Port</label>
              <Input
                type="number"
                value={infrastructureData.deployPort}
                onChange={(e) =>
                  handleInfrastructureChange("deployPort")(e.target.value)
                }
                min={1}
                max={65535}
                placeholder="Enter deploy port"
                className={inputClass}
              />
            </div>

            {/* Username */}
            <div>
              <label className={labelClass}>Username</label>
              <Input
                type="text"
                value={infrastructureData.username}
                onChange={(e) =>
                  handleInfrastructureChange("username")(e.target.value)
                }
                placeholder="Enter username"
                className={inputClass}
              />
            </div>

            {/* Dataset Path */}
            <div>
              <label className={labelClass}>Dataset Path</label>
              <Input
                type="text"
                value={infrastructureData.datasetPath}
                onChange={(e) =>
                  handleInfrastructureChange("datasetPath")(e.target.value)
                }
                placeholder="Enter dataset path"
                className={inputClass}
              />
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
