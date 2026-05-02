import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllExperiments } from "src/features/project-build/api/experiment";
import { getAllDeployedModel } from "src/features/deploy/api/deploy";
import { getModels } from "src/features/models/api/model";
import StatusCard from "src/features/projects/components/StatusCard";
import MetaDataItem from "src/features/projects/components/MetaDataItem";
import {
  CircleCheck,
  RefreshCw,
  CircleX,
  Server,
  Settings,
  FlaskConical,
  Database,
  Cloud,
  LayoutDashboard,
} from "lucide-react";
import { PageHeading } from "src/components/ui/page-heading";

const ProjectInfo = () => {
  const { projectInfo } = useOutletContext();
  const [experiments, setExperiments] = useState([]);
  const [models, setModels] = useState([]);
  const [deployedModels, setDeployedModels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const experimentsData = await getAllExperiments(projectInfo.id);
        const modelsData = await getModels(projectInfo.id);
        const deployedModelsData = await getAllDeployedModel(projectInfo.id);

        setExperiments(
          Array.isArray(experimentsData)
            ? experimentsData
            : experimentsData.data || [],
        );
        setModels(
          Array.isArray(modelsData) ? modelsData : modelsData.data || [],
        );
        setDeployedModels(
          Array.isArray(deployedModelsData)
            ? deployedModelsData
            : deployedModelsData.data || [],
        );
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (projectInfo?.id) fetchData();
  }, [projectInfo]);

  const formattedDate = projectInfo?.created_at
    ? new Date(projectInfo.created_at).toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const inProgressStatuses = new Set([
    "TRAINING",
    "SETTING_UP",
    "CREATING_INSTANCE",
    "DOWNLOADING_DATA",
    "DOWNLOADING_DEPENDENCIES",
  ]);

  return (
    <div className="w-full px-6 py-8">
      {/* Page Header */}
      <PageHeading
        icon={LayoutDashboard}
        title="Project Overview"
        description={
          projectInfo?.description ||
          "Metrics and deployment status at a glance"
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* Project Details */}
        <div className="xl:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Settings className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Project Details
              </h2>
            </div>
            <div className="space-y-3">
              <MetaDataItem label="Project name" value={projectInfo?.name} />
              <MetaDataItem label="Task Type" value={projectInfo?.task_type} />
              <MetaDataItem
                label="Expected Accuracy"
                value={projectInfo?.expected_accuracy}
              />
              <MetaDataItem label="Visibility" value={projectInfo?.visibility} />
              <MetaDataItem label="Created" value={formattedDate} />
            </div>
          </div>
        </div>

        {/* Right column: Experiments + Models + Deployed Models */}
        <div className="flex flex-col gap-6 xl:col-span-8">
          {/* Experiments */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <FlaskConical className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Experiments
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Training and validation status
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                label="Completed"
                value={experiments.filter((e) => e.status === "DONE").length}
                color={{
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                  iconText: "text-emerald-600 dark:text-emerald-400",
                  valueText: "text-emerald-700 dark:text-emerald-400",
                }}
                Icon={CircleCheck}
              />
              <StatusCard
                label="In Progress"
                value={
                  experiments.filter((e) => inProgressStatuses.has(e.status))
                    .length
                }
                color={{
                  iconBg: "bg-blue-100 dark:bg-blue-900/30",
                  iconText: "text-blue-600 dark:text-blue-400",
                  valueText: "text-blue-700 dark:text-blue-400",
                }}
                Icon={RefreshCw}
              />
              <StatusCard
                label="Failed"
                value={
                  experiments.filter((e) => e.status === "FAILED").length
                }
                color={{
                  iconBg: "bg-red-100 dark:bg-red-900/30",
                  iconText: "text-red-600 dark:text-red-400",
                  valueText: "text-red-700 dark:text-red-400",
                }}
                Icon={CircleX}
              />
            </div>
          </div>

          {/* Models */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Database className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Models
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Available trained models
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                label="Ready"
                value={models.length}
                color={{
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                  iconText: "text-emerald-600 dark:text-emerald-400",
                  valueText: "text-emerald-700 dark:text-emerald-400",
                }}
                Icon={CircleCheck}
              />
            </div>
          </div>

          {/* Deployed Models */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Cloud className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Deployed Models
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Production deployment status
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                label="Online"
                value={
                  deployedModels.filter((d) => d.status === "ONLINE").length
                }
                color={{
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                  iconText: "text-emerald-600 dark:text-emerald-400",
                  valueText: "text-emerald-700 dark:text-emerald-400",
                }}
                Icon={Server}
              />
              <StatusCard
                label="Setting Up"
                value={
                  deployedModels.filter((d) => d.status === "SETTING_UP")
                    .length
                }
                color={{
                  iconBg: "bg-amber-100 dark:bg-amber-900/30",
                  iconText: "text-amber-600 dark:text-amber-400",
                  valueText: "text-amber-700 dark:text-amber-400",
                }}
                Icon={Settings}
              />
              <StatusCard
                label="Offline"
                value={
                  deployedModels.filter((d) => d.status === "OFFLINE").length
                }
                color={{
                  iconBg: "bg-red-100 dark:bg-red-900/30",
                  iconText: "text-red-600 dark:text-red-400",
                  valueText: "text-red-700 dark:text-red-400",
                }}
                Icon={CircleX}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
