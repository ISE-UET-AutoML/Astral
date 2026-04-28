import type { KeyboardEvent } from "react";
import {
  Clock,
  Server,
  HardDrive,
  DollarSign,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const TRAINING_METHODS = [
  { key: "autogluon", tag: "autogluon", label: "AutoGluon" },
  { key: "iml", tag: "iml", label: "iML" },
];

export const TRAINING_MODE_TAGS = {
  autogluon: "autogluon",
  iml: "iml",
};

export const SERVICES = [
  {
    name: "VastAI",
    description: "Cost-effective GPU instances",
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "AWS EC2",
    description: "Reliable and scalable computing",
    icon: <Server className="h-5 w-5" />,
  },
  {
    name: "GCP Compute",
    description: "High-performance cloud computing",
    icon: <Server className="h-5 w-5" />,
  },
];

export const GPU_NAMES = ["RTX_3060", "RTX_4090"];

export const GPU_LEVELS = [
  {
    name: "RTX 3060",
    gpuNumber: 1,
    disk: 10,
    cost: 0.2,
    performance: "Weak",
    memory: "8GB",
  },
  {
    name: "RTX 3070",
    gpuNumber: 2,
    disk: 20,
    cost: 0.4,
    performance: "Medium",
    memory: "12GB",
  },
  {
    name: "RTX 3080",
    gpuNumber: 4,
    disk: 30,
    cost: 0.8,
    performance: "Strong",
    memory: "16GB",
  },
  {
    name: "RTX 3090",
    gpuNumber: 6,
    disk: 40,
    cost: 1.0,
    performance: "Super Strong",
    memory: "24GB",
  },
  {
    name: "RTX 4090",
    gpuNumber: 8,
    disk: 50,
    cost: 2.0,
    performance: "Rocket",
    memory: "24GB",
  },
];

type GpuLevel = (typeof GPU_LEVELS)[number];
type InstanceSizeDetails = {
  title: string;
  suitable: string;
  gpuRange: string;
  memory: string;
  recommended: string;
  color: string;
  instanceDetails: GpuLevel;
};

export const INSTANCE_SIZE_DETAILS = {
  Weak: {
    title: "🛠️ Basic Configuration",
    suitable: "Small datasets and simple models",
    gpuRange: "1-2 GPUs",
    memory: "Basic memory allocation",
    recommended: "Testing and development",
    color: "var(--accent-text)",
    instanceDetails: GPU_LEVELS[0],
  },
  Medium: {
    title: "⚖️ Balanced Setup",
    suitable: "Moderate workloads",
    gpuRange: "2-4 GPUs",
    memory: "Increased memory capacity",
    recommended: "Regular training tasks",
    color: "var(--accent-text)",
    instanceDetails: GPU_LEVELS[1],
  },
  Strong: {
    title: "🔥 Enhanced Performance",
    suitable: "Larger datasets",
    gpuRange: "4-6 GPUs",
    memory: "High memory allocation",
    recommended: "Complex model training",
    color: "var(--accent-text)",
    instanceDetails: GPU_LEVELS[2],
  },
  "Super Strong": {
    title: "⚡ High Performance",
    suitable: "Demanding workloads",
    gpuRange: "6-8 GPUs",
    memory: "Extended memory capacity",
    recommended: "Large-scale training",
    color: "var(--accent-text)",
    instanceDetails: GPU_LEVELS[3],
  },
  Rocket: {
    title: "🚀 Maximum Power",
    suitable: "Enterprise-level tasks",
    gpuRange: "8+ GPUs",
    memory: "Maximum memory allocation",
    recommended: "Production deployment",
    color: "var(--accent-text)",
    instanceDetails: GPU_LEVELS[4],
  },
};

export const generateRandomKey = () => {
  // Generate a random string to use as a key
  const randomString =
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);

  // Use crypto-js to create a SHA-256 hash of the random string
  // const hash = CryptoJS.SHA256(randomString).toString()
  const hash = "hardcoded-hash-for-example"; // Placeholder for the hash
  // Format as an SSH public key (simplified version)
  return `ssh-rsa ${hash} generated-key`;
};

type InstanceSizeCardProps = {
  size: string;
  details: InstanceSizeDetails;
  selected: boolean;
  onClick: () => void;
};

export const InstanceSizeCard = ({
  size: _size,
  details,
  selected,
  onClick,
}: InstanceSizeCardProps) => (
  <button
    type="button"
    onClick={onClick}
    onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) =>
      e.key === "Enter" && onClick()
    }
    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border ${
      selected
        ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/30"
        : "border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-600"
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <h3
        className={`text-lg font-bold ${
          selected
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {details.title}
      </h3>
      {selected && (
        <div className="h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-500"></div>
      )}
    </div>

    {selected && (
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
            Suitable for
          </p>
          <p className="text-sm text-gray-900 dark:text-white">
            {details.suitable}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
            GPU Range
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {details.gpuRange}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
            Memory
          </p>
          <p className="text-sm text-gray-900 dark:text-white">
            {details.memory}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">
            Recommended
          </p>
          <p className="text-sm text-gray-900 dark:text-white">
            {details.recommended}
          </p>
        </div>
      </div>
    )}
  </button>
);

export const CostEstimator = ({
  hours,
  gpuLevel,
  onStartTraining,
  isProcessing,
  canStart,
}: {
  hours: number;
  gpuLevel?: Partial<GpuLevel>;
  onStartTraining?: () => void;
  isProcessing?: boolean;
  canStart?: boolean;
}) => {
  const hourlyRate = gpuLevel?.cost || 0;
  const totalCost = hours * hourlyRate;

  return (
    <div className="rounded-2xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-slate-900 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Cost Estimation
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Hourly Rate
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${hourlyRate}/hour
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Training Hours
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {hours} hours
          </span>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Estimated Total
            </span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ${totalCost.toFixed(2)}
            </span>
          </div>

          {onStartTraining && (
            <button
              type="button"
              onClick={onStartTraining}
              disabled={!canStart || isProcessing}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Finding instance...
                </>
              ) : (
                "Start Training"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

type InstanceFormData = {
  gpuName?: string;
  gpuNumber?: number;
  disk?: number;
  service?: string;
  trainingTime?: number;
  cost?: number;
};

export const InstanceInfo = ({ formData }: { formData: InstanceFormData }) => {
  const selectedGPU = GPU_LEVELS.find((gpu) => gpu.name === formData.gpuName);

  return (
    <div className="rounded-2xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Instance Configuration
        </h3>
        <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware Specs */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Hardware Specs
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">GPUs:</span> {formData.gpuNumber}x{" "}
                {formData.gpuName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Storage:</span> {formData.disk} GB
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Provider:</span>{" "}
                {formData.service}
              </span>
            </div>
          </div>
        </div>

        {/* Training Details */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Training Details
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Duration:</span>{" "}
                {formData.trainingTime} hours
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Cost:</span> ${formData.cost}/hour
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
