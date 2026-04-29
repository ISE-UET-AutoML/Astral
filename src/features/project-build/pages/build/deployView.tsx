import React, { useState, ReactNode } from "react";
import { Button } from "src/components/ui/button";
import {
  Rocket as RocketOutlined,
  Zap as ThunderboltOutlined,
  Database as DatabaseOutlined,
  Cloud as CloudDownloadOutlined,
} from "lucide-react";
import { useSpring, animated } from "@react-spring/web";
import * as modelAPI from "src/features/models/api/model";
import { PATHS } from "src/constants/paths";
import {
  useLocation,
  useOutletContext,
  useNavigate,
  useParams,
} from "react-router-dom";

const AnimatedCard = ({
  children,
  onClick,
  isSelected,
}: {
  children: ReactNode;
  onClick: () => void;
  isSelected: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useSpring({
    transform: isHovered ? "scale(1.02)" : "scale(1)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div
      style={{
        ...styles,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </animated.div>
  );
};

const DeployView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id: projectId } = useParams();
  const modelId = searchParams.get("modelId");
  const modelVersionId = searchParams.get("modelVersionId");
  const imlIteration = searchParams.get("imlIteration");
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const deployOptions = [
    {
      id: "realtime",
      title: "Realtime Inference",
      description: "Deploy for immediate, real-time predictions",
      icon: ThunderboltOutlined,
      tags: ["Low Latency", "High Availability", "Auto Scaling"],
      stats: {
        latency: "< 100ms",
        uptime: "99.99%",
        scalability: "Automatic",
      },
      badge: "RECOMMENDED",
      accentColor: "amber",
    },
    {
      id: "async",
      title: "Asynchronous Processing",
      description: "Optimal for handling large batch requests",
      icon: ThunderboltOutlined,
      tags: ["High Throughput", "Cost Effective", "Durable"],
      stats: {
        throughput: "10K req/s",
        durability: "99.999%",
        cost: "Medium",
      },
      accentColor: "emerald",
    },
    {
      id: "batch",
      title: "Batch Transform",
      description: "Process large datasets efficiently",
      icon: DatabaseOutlined,
      tags: ["Large Scale", "Cost Optimized", "Scheduled"],
      stats: {
        capacity: "Unlimited",
        efficiency: "95%",
        schedule: "Flexible",
      },
      accentColor: "blue",
    },
    {
      id: "serverless",
      title: "Serverless Deployment",
      description: "Pay-per-use with zero infrastructure management",
      icon: CloudDownloadOutlined,
      tags: ["Zero Maintenance", "Auto Scaling", "Cost Efficient"],
      stats: {
        scaling: "Automatic",
        maintenance: "Zero",
        billing: "Per Request",
      },
      accentColor: "purple",
    },
  ];

  const startDeployment = async () => {
    try {
      navigate(PATHS.SETTING_UP_DEPLOY(projectId, "temp-deploy-id"));

      const deployRequest = await modelAPI.deployModel(modelId, modelVersionId, {
        iml_iteration_name: imlIteration || undefined,
      });
      console.log(deployRequest);
      if (deployRequest.status !== 200) {
        throw new Error("Failed to deploy model");
      }
      navigate(
        PATHS.SETTING_UP_DEPLOY(projectId, deployRequest.data?.model_deploy.id),
        { replace: true },
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancel = () => {
    setIsDeploying(false);
    setSelectedOption("");
    if (modelId) {
      navigate(PATHS.MODEL_VIEW(projectId, modelId));
      return;
    }
    navigate(-1);
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-slate-950">
      <div className="relative z-10 w-full px-3 py-6 sm:px-4 lg:px-6 lg:py-8 mx-auto space-y-6">
        <div className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 py-10 px-16">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <RocketOutlined className="text-[28px] text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Deploy Model
              </h1>
            </div>
            <p className="text-[16px] text-gray-700 dark:text-gray-300">
              Choose your deployment option and launch your application with our
              optimized infrastructure
            </p>
          </div>

          <div className="mt-6 grid gap-10 md:grid-cols-2 px-4 mb-10">
            {deployOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;

              const accentColors: Record<
                string,
                {
                  icon: string;
                  bg: string;
                  darkBg: string;
                  text: string;
                  border: string;
                }
              > = {
                amber: {
                  icon: "text-amber-500",
                  bg: "bg-amber-50",
                  darkBg: "dark:bg-amber-950/20",
                  text: "text-amber-600 dark:text-amber-400",
                  border: "border-amber-200 dark:border-amber-700",
                },
                emerald: {
                  icon: "text-emerald-500",
                  bg: "bg-emerald-50",
                  darkBg: "dark:bg-emerald-950/20",
                  text: "text-emerald-600 dark:text-emerald-400",
                  border: "border-emerald-200 dark:border-emerald-700",
                },
                blue: {
                  icon: "text-blue-500",
                  bg: "bg-blue-50",
                  darkBg: "dark:bg-blue-950/20",
                  text: "text-blue-600 dark:text-blue-400",
                  border: "border-blue-200 dark:border-blue-700",
                },
                purple: {
                  icon: "text-purple-500",
                  bg: "bg-purple-50",
                  darkBg: "dark:bg-purple-950/20",
                  text: "text-purple-600 dark:text-purple-400",
                  border: "border-purple-200 dark:border-purple-700",
                },
              };

              const colors = accentColors[option.accentColor as string];

              return (
                <div key={option.id}>
                  <AnimatedCard
                    isSelected={isSelected}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div
                      className={`h-full rounded-xl border p-6 transition-all duration-300 ${
                        isSelected
                          ? `${colors.bg} ${colors.darkBg} ${colors.border} border-2`
                          : `border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-gray-600`
                      }`}
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-lg p-3 ${colors.bg} ${colors.darkBg}`}
                            >
                              <Icon className={`text-2xl ${colors.icon}`} />
                            </div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                              {option.title}
                            </h2>
                          </div>
                          {option.badge && (
                            <div
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}
                            >
                              {option.badge}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {option.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.border} ${colors.text}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          {Object.entries(option.stats).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <div className="font-medium text-gray-600 dark:text-gray-400 capitalize">
                                {key}
                              </div>
                              <div className={`font-semibold ${colors.text}`}>
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="rounded-xl px-6 py-5 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={startDeployment}
            disabled={!selectedOption}
            className="rounded-xl px-6 py-5 font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deploy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeployView;
