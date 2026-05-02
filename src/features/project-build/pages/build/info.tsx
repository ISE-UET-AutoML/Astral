import { useEffect, useMemo, useState } from "react";
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
  Info,
} from "lucide-react";
import { PageHeading } from "src/components/ui/page-heading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";

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

  const expDone = experiments.filter((e) => e.status === "DONE").length;
  const expInProgress = experiments.filter((e) =>
    inProgressStatuses.has(e.status),
  ).length;
  const expFailed = experiments.filter((e) => e.status === "FAILED").length;
  const expTotal = experiments.length;

  const expById = useMemo(
    () => new Map(experiments.map((e) => [e.id, e])),
    [experiments],
  );

  const modelExperimentStatus = (m) =>
    expById.get(m.experiment_id)?.status;

  const modelsFailedCount = models.filter(
    (m) => modelExperimentStatus(m) === "FAILED",
  ).length;
  const modelsReadyCount = models.filter(
    (m) => modelExperimentStatus(m) === "DONE",
  ).length;
  const modelsOtherCount =
    models.length - modelsFailedCount - modelsReadyCount;

  const experimentFractionLabel =
    expTotal === 1 ? "of 1 experiment" : `of ${expTotal} experiments`;

  const showExperimentPerCardBar = expTotal > 0 && expFailed === 0;

  const deployOnline = deployedModels.filter((d) => d.status === "ONLINE").length;
  const deploySettingUp = deployedModels.filter(
    (d) => d.status === "SETTING_UP",
  ).length;
  const deployOffline = deployedModels.filter((d) => d.status === "OFFLINE")
    .length;

  const deployTotal = deployedModels.length;
  const deployFractionLabel =
    deployTotal === 1
      ? "of 1 deployment"
      : `of ${deployTotal} deployments`;
  const deployOther = Math.max(
    0,
    deployTotal -
      deployOnline -
      deployOffline -
      deploySettingUp,
  );

  const deployNeedsMixBar =
    deployTotal > 0 &&
    (deployOffline > 0 ||
      deploySettingUp > 0 ||
      deployOther > 0 ||
      deployOnline < deployTotal);

  /** Homogeneous all-online fleet: single green bar on Online card. */
  const deployAllOnlineHomogeneous =
    deployTotal > 0 && !deployNeedsMixBar;

  return (
    <div className="w-full py-8">
      <PageHeading
        icon={LayoutDashboard}
        title="Project Overview"
        description={
          projectInfo?.description ||
          "Metrics and deployment status at a glance"
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12 xl:items-start">
        <div className="xl:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Settings className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Project details
              </h2>
            </div>
            <div className="space-y-5">
              <MetaDataItem label="Project name" value={projectInfo?.name} />
              <MetaDataItem label="Task type" value={projectInfo?.task_type} />
              <MetaDataItem
                label="Expected accuracy"
                value={projectInfo?.expected_accuracy}
              />
              <MetaDataItem label="Created" value={formattedDate} />
              <MetaDataItem label="Visibility" value={projectInfo?.visibility} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 xl:col-span-9">
        <div className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <FlaskConical className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Experiments
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Training and validation status
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                size="lg"
                label="Completed"
                value={expDone}
                fraction={
                  expTotal > 0
                    ? { num: expDone, den: expTotal }
                    : undefined
                }
                fractionLabel={experimentFractionLabel}
                showFractionBar={showExperimentPerCardBar}
                progressIndicatorClassName="[&_[data-slot=progress-indicator]]:!bg-emerald-600 dark:[&_[data-slot=progress-indicator]]:!bg-emerald-500"
                color={{
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                  iconText: "text-emerald-600 dark:text-emerald-400",
                  valueText: "text-emerald-700 dark:text-emerald-400",
                }}
                Icon={CircleCheck}
              />
              <StatusCard
                size="lg"
                label="In progress"
                value={expInProgress}
                fraction={
                  expTotal > 0
                    ? { num: expInProgress, den: expTotal }
                    : undefined
                }
                fractionLabel={experimentFractionLabel}
                showFractionBar={showExperimentPerCardBar}
                progressIndicatorClassName="[&_[data-slot=progress-indicator]]:!bg-amber-600 dark:[&_[data-slot=progress-indicator]]:!bg-amber-500"
                color={{
                  iconBg: "bg-amber-100 dark:bg-amber-900/30",
                  iconText: "text-amber-600 dark:text-amber-400",
                  valueText: "text-amber-700 dark:text-amber-400",
                }}
                Icon={RefreshCw}
              />
              <StatusCard
                size="lg"
                label="Failed"
                value={expFailed}
                fraction={
                  expTotal > 0
                    ? { num: expFailed, den: expTotal }
                    : undefined
                }
                fractionLabel={experimentFractionLabel}
                showFractionBar={showExperimentPerCardBar}
                progressIndicatorClassName="[&_[data-slot=progress-indicator]]:!bg-red-600 dark:[&_[data-slot=progress-indicator]]:!bg-red-500"
                color={{
                  iconBg: "bg-red-100 dark:bg-red-900/30",
                  iconText: "text-red-600 dark:text-red-400",
                  valueText: "text-red-700 dark:text-red-400",
                }}
                Icon={CircleX}
              />
            </div>
            {expTotal > 0 && expFailed > 0 ? (
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-white/10">
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  {expDone > 0 ? (
                    <div
                      className="h-full min-w-0 bg-emerald-500 dark:bg-emerald-400"
                      style={{ width: `${(100 * expDone) / expTotal}%` }}
                      title={`Completed: ${expDone}`}
                    />
                  ) : null}
                  {expInProgress > 0 ? (
                    <div
                      className="h-full min-w-0 bg-amber-500 dark:bg-amber-400"
                      style={{ width: `${(100 * expInProgress) / expTotal}%` }}
                      title={`In progress: ${expInProgress}`}
                    />
                  ) : null}
                  {expFailed > 0 ? (
                    <div
                      className="h-full min-w-0 bg-red-500 dark:bg-red-400"
                      style={{ width: `${(100 * expFailed) / expTotal}%` }}
                      title={`Failed: ${expFailed}`}
                    />
                  ) : null}
                </div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      aria-hidden
                    />
                    Green = completed
                  </span>
                  <span className="text-gray-400 dark:text-gray-500" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400"
                      aria-hidden
                    />
                    Amber = in progress
                  </span>
                  <span className="text-gray-400 dark:text-gray-500" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-red-500 dark:bg-red-400"
                      aria-hidden
                    />
                    Red = failed
                  </span>
                </p>
              </div>
            ) : null}
            {expTotal === 0 ? (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                No experiments yet. Start a build from the sidebar.
              </p>
            ) : null}
          </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Database className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Models
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Available trained models
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {models.length === 0 ? null : modelsFailedCount > 0 ? (
                <>
                  <StatusCard
                    size="lg"
                    label="Ready"
                    value={modelsReadyCount}
                    color={{
                      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                      iconText: "text-emerald-600 dark:text-emerald-400",
                      valueText: "text-emerald-700 dark:text-emerald-400",
                    }}
                    Icon={CircleCheck}
                  />
                  <StatusCard
                    size="lg"
                    label="Failed"
                    value={modelsFailedCount}
                    color={{
                      iconBg: "bg-red-100 dark:bg-red-900/30",
                      iconText: "text-red-600 dark:text-red-400",
                      valueText: "text-red-700 dark:text-red-400",
                    }}
                    Icon={CircleX}
                  />
                </>
              ) : modelsOtherCount > 0 ? (
                <>
                  <StatusCard
                    size="lg"
                    label="Ready"
                    value={modelsReadyCount}
                    footnote={
                      modelsReadyCount === models.length
                        ? `${modelsReadyCount} / ${models.length} model${models.length === 1 ? "" : "s"} ready`
                        : `${modelsReadyCount} of ${models.length} model${models.length === 1 ? "" : "s"} from completed experiments`
                    }
                    color={{
                      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                      iconText: "text-emerald-600 dark:text-emerald-400",
                      valueText: "text-emerald-700 dark:text-emerald-400",
                    }}
                    Icon={CircleCheck}
                  />
                  <StatusCard
                    size="lg"
                    label="Not ready"
                    value={modelsOtherCount}
                    footnote="Training or not finished yet"
                    color={{
                      iconBg: "bg-slate-100 dark:bg-slate-800/50",
                      iconText: "text-slate-600 dark:text-slate-400",
                      valueText: "text-slate-800 dark:text-slate-200",
                    }}
                    Icon={RefreshCw}
                  />
                </>
              ) : (
                <>
                  <StatusCard
                    size="lg"
                    label="Ready"
                    value={models.length}
                    footnote={`${models.length} / ${models.length} model${models.length === 1 ? "" : "s"} ready`}
                    color={{
                      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                      iconText: "text-emerald-600 dark:text-emerald-400",
                      valueText: "text-emerald-700 dark:text-emerald-400",
                    }}
                    Icon={CircleCheck}
                  />
                  <StatusCard
                    size="lg"
                    label="Failed"
                    value={0}
                    footnote="No failed models"
                    color={{
                      iconBg: "bg-gray-100 dark:bg-white/5",
                      iconText: "text-gray-400 dark:text-gray-500",
                      valueText: "text-gray-500 dark:text-gray-400",
                    }}
                    Icon={CircleX}
                  />
                </>
              )}
            </div>
            {models.length > 0 && modelsOtherCount > 0 ? (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                Not ready counts models whose runs are not{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  DONE
                </span>{" "}
                or{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  FAILED
                </span>{" "}
                yet.
              </p>
            ) : models.length === 0 ? (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                No models yet. Train an experiment to add a model.
              </p>
            ) : null}
          </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7 dark:border-white/10 dark:bg-slate-900 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <Cloud className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Deployed models
                  </h3>
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex shrink-0 rounded-md text-gray-600 outline-none hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500/80 dark:text-gray-300 dark:hover:text-white"
                          aria-label="How deployment totals are calculated"
                        >
                          <Info className="size-3.5" strokeWidth={2.5} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-left">
                        Counts and bars use every deployment record returned
                        for this project in this view
                        {deployTotal > 0 ? (
                          <>
                            {" "}
                            (
                            <span className="tabular-nums">{deployTotal}</span>{" "}
                            {deployTotal === 1 ? "record" : "records"}).
                          </>
                        ) : (
                          "."
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                  Production deployment status
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatusCard
                size="lg"
                label="Online"
                value={deployOnline}
                fraction={
                  deployTotal > 0
                    ? { num: deployOnline, den: deployTotal }
                    : undefined
                }
                fractionLabel={deployFractionLabel}
                showFractionBar={!deployNeedsMixBar}
                progressIndicatorClassName={
                  deployAllOnlineHomogeneous
                    ? "[&_[data-slot=progress-indicator]]:!bg-emerald-600 dark:[&_[data-slot=progress-indicator]]:!bg-emerald-500"
                    : "[&_[data-slot=progress-indicator]]:!bg-slate-400 dark:[&_[data-slot=progress-indicator]]:!bg-slate-500"
                }
                color={{
                  iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
                  iconText: "text-emerald-600 dark:text-emerald-400",
                  valueText: "text-emerald-700 dark:text-emerald-400",
                }}
                Icon={Server}
              />
              {deploySettingUp > 0 ? (
                <StatusCard
                  size="lg"
                  label="Setting up"
                  value={deploySettingUp}
                  fraction={
                    deployTotal > 0
                      ? { num: deploySettingUp, den: deployTotal }
                      : undefined
                  }
                  fractionLabel={deployFractionLabel}
                  showFractionBar={!deployNeedsMixBar}
                  progressIndicatorClassName="[&_[data-slot=progress-indicator]]:!bg-amber-600 dark:[&_[data-slot=progress-indicator]]:!bg-amber-500"
                  color={{
                    iconBg: "bg-amber-100 dark:bg-amber-900/30",
                    iconText: "text-amber-600 dark:text-amber-400",
                    valueText: "text-amber-700 dark:text-amber-400",
                  }}
                  Icon={Settings}
                />
              ) : null}
              {deployOffline > 0 ? (
                <StatusCard
                  size="lg"
                  label="Offline"
                  value={deployOffline}
                  fraction={
                    deployTotal > 0
                      ? { num: deployOffline, den: deployTotal }
                      : undefined
                  }
                  fractionLabel={deployFractionLabel}
                  showFractionBar={!deployNeedsMixBar}
                  progressIndicatorClassName="[&_[data-slot=progress-indicator]]:!bg-red-600 dark:[&_[data-slot=progress-indicator]]:!bg-red-500"
                  color={{
                    iconBg: "bg-red-100 dark:bg-red-900/30",
                    iconText: "text-red-600 dark:text-red-400",
                    valueText: "text-red-700 dark:text-red-400",
                  }}
                  Icon={CircleX}
                />
              ) : null}
            </div>
            {deployNeedsMixBar ? (
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-white/10">
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  {deployOnline > 0 ? (
                    <div
                      className="h-full min-w-0 bg-emerald-500 dark:bg-emerald-400"
                      style={{
                        width: `${(100 * deployOnline) / deployTotal}%`,
                      }}
                      title={`Online: ${deployOnline}`}
                    />
                  ) : null}
                  {deploySettingUp > 0 ? (
                    <div
                      className="h-full min-w-0 bg-amber-500 dark:bg-amber-400"
                      style={{
                        width: `${(100 * deploySettingUp) / deployTotal}%`,
                      }}
                      title={`Setting up: ${deploySettingUp}`}
                    />
                  ) : null}
                  {deployOffline > 0 ? (
                    <div
                      className="h-full min-w-0 bg-red-500 dark:bg-red-400"
                      style={{
                        width: `${(100 * deployOffline) / deployTotal}%`,
                      }}
                      title={`Offline: ${deployOffline}`}
                    />
                  ) : null}
                  {deployOther > 0 ? (
                    <div
                      className="h-full min-w-0 bg-slate-400 dark:bg-slate-500"
                      style={{
                        width: `${(100 * deployOther) / deployTotal}%`,
                      }}
                      title={`Other states: ${deployOther}`}
                    />
                  ) : null}
                </div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-300">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-emerald-500 dark:bg-emerald-400"
                      aria-hidden
                    />
                    Green = online
                  </span>
                  <span className="text-gray-400 dark:text-gray-500" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-amber-500 dark:bg-amber-400"
                      aria-hidden
                    />
                    Amber = setting up
                  </span>
                  <span className="text-gray-400 dark:text-gray-500" aria-hidden>
                    ·
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full bg-red-500 dark:bg-red-400"
                      aria-hidden
                    />
                    Red = offline
                  </span>
                  {deployOther > 0 ? (
                    <>
                      <span
                        className="text-gray-400 dark:text-gray-500"
                        aria-hidden
                      >
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="size-2 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500"
                          aria-hidden
                        />
                        Gray = other states
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
