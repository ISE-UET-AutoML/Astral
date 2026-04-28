import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getAllExperiments } from "src/features/project-build/api/experiment";
import { getAllDeployedModel } from "src/features/deploy/api/deploy";
import { getModels } from "src/features/models/api/model";
import StatusCard from "src/features/projects/components/StatusCard";
import MetaDataItem from "src/features/projects/components/MetaDataItem";
import {
  CircleCheck as CheckCircleOutlined,
  RefreshCw as SyncOutlined,
  CircleX as CloseCircleOutlined,
  Server as CloudServerOutlined,
  Settings as SettingOutlined,
  FlaskConical as ExperimentOutlined,
  Database as DatabaseOutlined,
  Cloud as CloudOutlined,
} from "lucide-react";

// Ant Design icons

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
        console.log(projectInfo);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (projectInfo?.id) fetchData();
  }, [projectInfo]);

  // Format created_at
  const formattedDate = new Date(projectInfo?.created_at).toLocaleString(
    "en-US",
    {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="w-full px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Project Overview
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {projectInfo?.description ||
                  "Comprehensive overview of your project metrics and deployment status"}
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-4">
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900/50 flex flex-col">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 rounded-xl bg-blue-500/10">
                      <SettingOutlined className="text-lg text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      Project Details
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <MetaDataItem
                      label="Project name"
                      value={projectInfo?.name}
                    />
                    <MetaDataItem
                      label="Task Type"
                      value={projectInfo?.task_type}
                    />
                    <MetaDataItem
                      label="Expected Accuracy"
                      value={projectInfo?.expected_accuracy}
                    />
                    <MetaDataItem
                      label="Visibility"
                      value={projectInfo?.visibility}
                    />
                    <MetaDataItem label="Created" value={formattedDate} />
                  </div>
                </div>
              </div>

              <div className="xl:col-span-8 flex flex-col gap-6">
                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900/50 flex flex-col">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-blue-500/10">
                      <ExperimentOutlined className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Experiments
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Training and validation status
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatusCard
                      label="Completed"
                      value={
                        experiments.filter((e) => e.status === "DONE").length
                      }
                      color={{
                        bg: "bg-green-500/10",
                        border: "border-green-400/30",
                        text: "text-green-300",
                      }}
                      Icon={CheckCircleOutlined}
                    />
                    <StatusCard
                      label="In Progress"
                      value={
                        experiments.filter(
                          (e) =>
                            e.status === "TRAINING" ||
                            e.status === "SETTING_UP" ||
                            e.status === "CREATING_INSTANCE" ||
                            e.status === "DOWNLOADING_DATA" ||
                            e.status === "DOWNLOADING_DEPENDENCIES",
                        ).length
                      }
                      color={{
                        bg: "bg-blue-500/10",
                        border: "border-blue-400/30",
                        text: "text-blue-300",
                      }}
                      Icon={SyncOutlined}
                    />
                    <StatusCard
                      label="Failed"
                      value={
                        experiments.filter((e) => e.status === "FAILED").length
                      }
                      color={{
                        bg: "bg-red-500/10",
                        border: "border-red-400/30",
                        text: "text-red-300",
                      }}
                      Icon={CloseCircleOutlined}
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900/50 flex flex-col">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-blue-500/10">
                      <DatabaseOutlined className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Models
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Available trained models
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatusCard
                      label="Ready"
                      value={models.length}
                      color={{
                        bg: "bg-green-500/10",
                        border: "border-green-400/30",
                        text: "text-green-300",
                      }}
                      Icon={CheckCircleOutlined}
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900/50 flex flex-col">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-blue-500/10">
                      <CloudOutlined className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Deployed Models
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Production deployment status
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatusCard
                      label="Online"
                      value={
                        deployedModels.filter((d) => d.status === "ONLINE")
                          .length
                      }
                      color={{
                        bg: "bg-green-500/10",
                        border: "border-green-400/30",
                        text: "text-green-300",
                      }}
                      Icon={CloudServerOutlined}
                    />
                    <StatusCard
                      label="Setting Up"
                      value={
                        deployedModels.filter((d) => d.status === "SETTING_UP")
                          .length
                      }
                      color={{
                        bg: "bg-blue-500/10",
                        border: "border-blue-400/30",
                        text: "text-blue-300",
                      }}
                      Icon={SettingOutlined}
                    />
                    <StatusCard
                      label="Offline"
                      value={
                        deployedModels.filter((d) => d.status === "OFFLINE")
                          .length
                      }
                      color={{
                        bg: "bg-red-500/10",
                        border: "border-red-400/30",
                        text: "text-red-300",
                      }}
                      Icon={CloseCircleOutlined}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
