import { ReactNode, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  CloudDownload,
  Database,
  LoaderCircle,
  Rocket,
  Server,
  Settings,
} from "lucide-react";
import * as deployAPI from "src/features/deploy/api/deploy";
import { PATHS } from "src/constants/paths";

type DeployStatus =
  | "CREATING_INSTANCE"
  | "SELECTING_INSTANCE"
  | "SETTING_UP"
  | "DOWNLOADING_MODEL"
  | "OFFLINE"
  | "ONLINE";

type StepItem = {
  key: string;
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const settingUpProgress: StepItem[] = [
  {
    key: "virtual-environment",
    title: "Initialize Virtual Environment",
    description:
      "Set up a clean Python virtual environment to isolate project dependencies.",
  },
  {
    key: "update-os",
    title: "Updating Operating System",
    description: "Update system packages and apply compatibility patches.",
  },
  {
    key: "install-tools",
    title: "Installing Tools",
    description:
      "Install development tools and utilities required for deployment.",
  },
  {
    key: "install-dependencies",
    title: "Installing Dependencies",
    description:
      "Download and configure required libraries from the model runtime.",
  },
  {
    key: "cleanup",
    title: "Cleaning up conflicting packages",
    description: "Resolve package conflicts before starting the model service.",
  },
];

const selectingInstanceProgress: StepItem[] = [
  {
    key: "query-machine",
    title: "Querying Machine",
    description:
      "Searching for a suitable machine to deploy your application efficiently.",
  },
  {
    key: "ssh-protocol",
    title: "Initialize SSH Protocol",
    description: "Set up a secure SSH connection to access the remote machine.",
  },
  {
    key: "install-tools",
    title: "Installing Tools",
    description: "Install necessary deployment tools and utilities.",
  },
];

const downloadModelProgress: StepItem[] = [
  {
    key: "download-model",
    title: "Downloading Model from Cloud Storage",
    description: "Retrieving the required model files from cloud storage.",
  },
];

const initServerProgress: StepItem[] = [
  {
    key: "start-server",
    title: "Setting up your server",
    description: "Starting the model prediction server on port 8680.",
  },
];

function getCurrentStep(status?: string) {
  switch (status) {
    case "SETTING_UP":
      return 1;
    case "DOWNLOADING_MODEL":
      return 2;
    case "OFFLINE":
      return 3;
    case "CREATING_INSTANCE":
    case "SELECTING_INSTANCE":
    default:
      return 0;
  }
}

function getProgressSteps(status?: string) {
  switch (status) {
    case "SETTING_UP":
      return settingUpProgress;
    case "DOWNLOADING_MODEL":
      return downloadModelProgress;
    case "OFFLINE":
      return initServerProgress;
    case "CREATING_INSTANCE":
    case "SELECTING_INSTANCE":
    default:
      return selectingInstanceProgress;
  }
}

function StepIcon({
  active,
  completed,
  children,
}: {
  active: boolean;
  completed: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border bg-white text-gray-600 transition-colors dark:bg-white/5 dark:text-gray-300",
        active &&
          "border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-300",
        completed &&
          "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300",
      )}
    >
      {children}
    </span>
  );
}

function PreparationSteps({
  steps,
  currentStep,
}: {
  steps: StepItem[];
  currentStep: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const completed = index < currentStep;

        return (
          <div key={step.key} className="flex min-w-0 items-start gap-3">
            <StepIcon active={active} completed={completed}>
              {active ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                step.icon
              )}
            </StepIcon>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="whitespace-nowrap text-[15px] font-medium text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                {index < steps.length - 1 && (
                  <div className="hidden h-px flex-1 bg-gray-200 dark:bg-white/10 xl:block" />
                )}
              </div>
              <p className="mt-1 max-w-44 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProgressSteps({
  steps,
  currentStep,
}: {
  steps: StepItem[];
  currentStep: number;
}) {
  return (
    <div className="flex flex-col gap-5">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const completed = index < currentStep;

        return (
          <div key={step.key} className="relative flex gap-3">
            {index < steps.length - 1 && (
              <div
                className={cx(
                  "absolute left-[13px] top-8 h-[calc(100%-1rem)] w-px bg-gray-200 dark:bg-white/10",
                  (active || completed) && "bg-blue-400 dark:bg-blue-400/60",
                )}
              />
            )}
            <StepIcon active={active} completed={completed}>
              {active ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <span className="size-2 rounded-full bg-current" />
              )}
            </StepIcon>
            <div className="min-w-0 pb-0.5">
              <div className="text-[15px] font-medium text-gray-900 dark:text-white">
                {step.title}
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function DeploySettingUpView() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const deployId = searchParams.get("deployId");
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [deployStatus, setDeployStatus] =
    useState<DeployStatus>("CREATING_INSTANCE");
  const [currentStep, setCurrentStep] = useState(getCurrentStep(deployStatus));
  const [currentSettingUpStep, setCurrentSettingUpStep] = useState(0);

  useEffect(() => {
    if (!deployId) return;

    const fetchDeployData = async () => {
      try {
        const deployModelRes = await deployAPI.getDeployData(deployId);
        const nextStatus =
          (deployModelRes.data?.status as DeployStatus | undefined) ||
          "CREATING_INSTANCE";

        setCurrentSettingUpStep((previousStep) =>
          nextStatus !== deployStatus ? 0 : previousStep + 1,
        );
        setDeployStatus(nextStatus);
        setCurrentStep(getCurrentStep(nextStatus));

        if (nextStatus === "ONLINE") {
          navigate(PATHS.MODEL_DEPLOY_VIEW(projectId, deployId));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDeployData();
    const interval = setInterval(fetchDeployData, 30000);
    return () => clearInterval(interval);
  }, [deployId, deployStatus, navigate, projectId]);

  const progressSteps = useMemo(
    () => getProgressSteps(deployStatus),
    [deployStatus],
  );
  const boundedProgressStep = Math.min(
    Math.max(currentSettingUpStep, 0),
    Math.max(progressSteps.length - 1, 0),
  );
  const preparationSteps: StepItem[] = [
    {
      key: "creating-instance",
      title: "Creating Instance",
      icon: <Database className="size-4" />,
      description: "Selecting suitable machine for you",
    },
    {
      key: "downloading-dependencies",
      title: "Downloading Dependencies",
      icon: <Settings className="size-4" />,
      description: "Setting up your machine",
    },
    {
      key: "downloading-model",
      title: "Downloading Model",
      icon: <CloudDownload className="size-4" />,
      description: "Fetching model from cloud storage",
    },
    {
      key: "initializing-server",
      title: "Initializing Server",
      icon: <Server className="size-4" />,
      description: "Serving your model",
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[var(--surface)] px-3 py-6 sm:px-4 lg:px-6 lg:py-8">
      <Card className="mx-auto w-full rounded-2xl border border-gray-200 bg-white/95 shadow-xl dark:border-white/10 dark:bg-white/5">
        <CardContent className="p-7 lg:p-10">
          <div className="mb-7 flex items-center gap-2">
            <Rocket className="size-5 text-gray-700 dark:text-gray-200" />
            <h2 className="m-0 text-xl font-bold text-gray-900 dark:text-white">
              Deployment Preparation
            </h2>
          </div>

          <PreparationSteps
            currentStep={currentStep}
            steps={preparationSteps}
          />

          <Card className="mt-7 overflow-hidden rounded-xl border border-gray-200 bg-gray-50/80 shadow-lg dark:border-white/10 dark:bg-white/5">
            <CardHeader className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
              <CardTitle className="m-0 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <Settings className="size-5 text-gray-600 dark:text-gray-300" />
                Current Step Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-5">
              <ProgressSteps
                currentStep={boundedProgressStep}
                steps={progressSteps}
              />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
