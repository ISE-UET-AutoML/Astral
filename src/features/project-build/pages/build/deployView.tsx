import React, { useState } from "react";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Rocket as RocketOutlined,
  Zap as ThunderboltOutlined,
  Database as DatabaseOutlined,
  Cloud as CloudOutlined,
} from "lucide-react";
import * as modelAPI from "src/features/models/api/model";
import { PATHS } from "src/constants/paths";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

type AccentKey = "amber" | "emerald" | "blue" | "indigo";

interface AccentStyle {
  icon: string;
  iconBg: string;
  tag: string;
  tagBorder: string;
  statText: string;
  selectedBg: string;
  selectedBorder: string;
}

const ACCENT_STYLES: Record<AccentKey, AccentStyle> = {
  amber: {
    icon: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    tag: "text-amber-700 dark:text-amber-400",
    tagBorder: "border-amber-200 dark:border-amber-700/50",
    statText: "text-amber-600 dark:text-amber-400",
    selectedBg: "bg-amber-50 dark:bg-amber-900/20",
    selectedBorder: "border-amber-400 dark:border-amber-600/60",
  },
  emerald: {
    icon: "text-emerald-500 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    tag: "text-emerald-700 dark:text-emerald-400",
    tagBorder: "border-emerald-200 dark:border-emerald-700/50",
    statText: "text-emerald-600 dark:text-emerald-400",
    selectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    selectedBorder: "border-emerald-400 dark:border-emerald-600/60",
  },
  blue: {
    icon: "text-blue-500 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    tag: "text-blue-700 dark:text-blue-400",
    tagBorder: "border-blue-200 dark:border-blue-700/50",
    statText: "text-blue-600 dark:text-blue-400",
    selectedBg: "bg-blue-50 dark:bg-blue-900/20",
    selectedBorder: "border-blue-400 dark:border-blue-600/60",
  },
  indigo: {
    icon: "text-indigo-500 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    tag: "text-indigo-700 dark:text-indigo-400",
    tagBorder: "border-indigo-200 dark:border-indigo-700/50",
    statText: "text-indigo-600 dark:text-indigo-400",
    selectedBg: "bg-indigo-50 dark:bg-indigo-900/20",
    selectedBorder: "border-indigo-400 dark:border-indigo-600/60",
  },
};

const deployOptions = [
  {
    id: "realtime",
    title: "Realtime Inference",
    description: "Deploy for immediate, real-time predictions",
    icon: ThunderboltOutlined,
    tags: ["Low Latency", "High Availability", "Auto Scaling"],
    stats: { Latency: "< 100ms", Uptime: "99.99%", Scalability: "Automatic" },
    badge: "RECOMMENDED",
    accent: "amber" as AccentKey,
  },
  {
    id: "async",
    title: "Asynchronous Processing",
    description: "Optimal for handling large batch requests",
    icon: ThunderboltOutlined,
    tags: ["High Throughput", "Cost Effective", "Durable"],
    stats: { Throughput: "10K req/s", Durability: "99.999%", Cost: "Medium" },
    accent: "emerald" as AccentKey,
  },
  {
    id: "batch",
    title: "Batch Transform",
    description: "Process large datasets efficiently",
    icon: DatabaseOutlined,
    tags: ["Large Scale", "Cost Optimized", "Scheduled"],
    stats: { Capacity: "Unlimited", Efficiency: "95%", Schedule: "Flexible" },
    accent: "blue" as AccentKey,
  },
  {
    id: "serverless",
    title: "Serverless Deployment",
    description: "Pay-per-use with zero infrastructure management",
    icon: CloudOutlined,
    tags: ["Zero Maintenance", "Auto Scaling", "Cost Efficient"],
    stats: { Scaling: "Automatic", Maintenance: "Zero", Billing: "Per Request" },
    accent: "indigo" as AccentKey,
  },
];

const DeployView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id: projectId } = useParams();
  const modelId = searchParams.get("modelId");
  const modelVersionId = searchParams.get("modelVersionId");
  const imlIteration = searchParams.get("imlIteration");
  const [selectedOption, setSelectedOption] = useState("");

  const startDeployment = async () => {
    try {
      navigate(PATHS.SETTING_UP_DEPLOY(projectId, "temp-deploy-id"));
      const deployRequest = await modelAPI.deployModel(modelId, modelVersionId, {
        iml_iteration_name: imlIteration || undefined,
      });
      if (deployRequest.status !== 200) throw new Error("Failed to deploy model");
      navigate(
        PATHS.SETTING_UP_DEPLOY(projectId, deployRequest.data?.model_deploy.id),
        { replace: true },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setSelectedOption("");
    if (modelId) {
      navigate(PATHS.MODEL_VIEW(projectId, modelId));
      return;
    }
    navigate(-1);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 space-y-6">

        {/* Page header */}
        <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
              <RocketOutlined className="size-7 text-blue-600 dark:text-blue-400" />
              Deploy Model
            </h1>
            <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              Choose your deployment strategy and launch your model with optimized infrastructure.
            </p>
          </div>
        </div>

        {/* Option cards */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900 lg:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {deployOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              const colors = ACCENT_STYLES[option.accent];

              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`group text-left rounded-xl border p-6 transition-all duration-200 hover:-translate-y-0.5 ${
                    isSelected
                      ? `${colors.selectedBg} ${colors.selectedBorder} border-2 ring-2 ring-blue-500/20`
                      : "border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm dark:border-white/10 dark:bg-slate-800/50 dark:hover:border-blue-700/40"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2.5 ${colors.iconBg}`}>
                          <Icon className={`size-5 ${colors.icon}`} />
                        </div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                          {option.title}
                        </h2>
                      </div>
                      {option.badge && (
                        <Badge className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                          {option.badge}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {option.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-lg border px-2.5 py-0.5 text-xs font-medium ${colors.tag} ${colors.tagBorder}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      {Object.entries(option.stats).map(([key, value]) => (
                        <div key={key}>
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {key}
                          </div>
                          <div className={`mt-0.5 font-semibold ${colors.statText}`}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="h-10 rounded-xl border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700/50 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={startDeployment}
            disabled={!selectedOption}
            className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            <RocketOutlined className="size-4" />
            Deploy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeployView;
