import { Loader2 } from "lucide-react";
import { Button } from "src/components/ui/button";
import {
  GPU_LEVELS,
  CostEstimator,
  InstanceInfo,
} from "src/constants/clouldInstance";

export function InstanceSummarySidebar({ formData, isProcessing, onStartTraining }) {
  return (
    <div className="flex flex-1 flex-col min-h-0 w-full">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        <InstanceInfo formData={formData} />
        <CostEstimator
          hours={formData.trainingTime}
          gpuLevel={GPU_LEVELS.find((gpu) => gpu.name === formData.gpuName)}
        />
      </div>
      <div className="shrink-0 pt-4">
        <Button
          type="button"
          onClick={onStartTraining}
          disabled={!formData.trainingTime || isProcessing}
          className="w-full h-10 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          {isProcessing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Finding instance…
            </>
          ) : (
            "Start Training"
          )}
        </Button>
      </div>
    </div>
  );
}
