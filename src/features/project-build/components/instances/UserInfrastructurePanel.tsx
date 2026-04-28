import React from "react";
import { Button } from "src/components/ui/button";
import { Clock } from "lucide-react";
import { InstanceMetricPill } from "./InstanceMetricPill";
import { InstanceSummarySidebar } from "./InstanceSummarySidebar";

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

        {/* Infrastructure Configuration Section */}
        <div className="rounded-2xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-slate-900 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Your Infrastructure
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                SSH Public Key
              </label>
              <textarea
                value={sshKey}
                readOnly
                rows={2}
                className="min-h-24 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              />
              <Button onClick={onCopySshKey} className="mt-2">
                Copy
              </Button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Instance ID
              </label>
              <input
                type="text"
                value={infrastructureData.id}
                onChange={(e) =>
                  handleInfrastructureChange("id")(e.target.value)
                }
                placeholder="Enter instance ID"
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                SSH Port
              </label>
              <input
                type="number"
                value={infrastructureData.sshPort}
                onChange={(e) =>
                  handleInfrastructureChange("sshPort")(e.target.value)
                }
                min={1}
                max={65535}
                placeholder="Enter SSH port"
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Public IP
              </label>
              <input
                type="text"
                value={infrastructureData.publicIP}
                onChange={(e) =>
                  handleInfrastructureChange("publicIP")(e.target.value)
                }
                placeholder="Enter public IP"
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Deploy Port
              </label>
              <input
                type="number"
                value={infrastructureData.deployPort}
                onChange={(e) =>
                  handleInfrastructureChange("deployPort")(e.target.value)
                }
                min={1}
                max={65535}
                placeholder="Enter deploy port"
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Username
              </label>
              <input
                type="text"
                value={infrastructureData.username}
                onChange={(e) =>
                  handleInfrastructureChange("username")(e.target.value)
                }
                placeholder="Enter username"
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Dataset Path
              </label>
              <input
                type="text"
                value={infrastructureData.datasetPath}
                onChange={(e) =>
                  handleInfrastructureChange("datasetPath")(e.target.value)
                }
                placeholder="Enter dataset path"
                className="w-full h-10 rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-white"
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
