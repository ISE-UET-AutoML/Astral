import { ReactNode } from "react";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { Button } from "src/components/ui/button";
import { Spinner } from "src/components/ui/spinner";
import {
  ChartLine as LineChartOutlined,
  CircleCheck as CheckCircleOutlined,
  CircleX as CloseCircleOutlined,
  CloudDownload as CloudDownloadOutlined,
  Database as DatabaseOutlined,
  LoaderCircle as LoadingOutlined,
  Rocket,
  Settings as SettingOutlined,
} from "lucide-react";

type TrainingStep = {
  key: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

type TrainingProgressStepsProps = {
  currentStep: number;
  status?: string;
  experimentName?: string;
  maxTrainingTime?: number;
  elapsedTime?: number;
  onViewResults?: () => void;
  currentSettingUpStep?: number;
  settingUpProgress?: TrainingStep[];
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

function StepList({
  steps,
  current = 0,
  compact = false,
}: {
  steps: TrainingStep[];
  current?: number;
  compact?: boolean;
}) {
  return (
    <div className={cx("flex flex-col", compact ? "gap-3" : "gap-4")}>
      {steps.map((step, index) => (
        <div
          key={step.key}
          className={cx(
            "group flex items-start gap-3 transition-colors",
            compact ? "px-0 py-0" : "px-1 py-0.5",
          )}
        >
          <span
            className={cx(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs",
              index < current &&
                "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300",
              index === current &&
                "border-blue-300 bg-white text-blue-600 shadow-sm dark:border-blue-400/40 dark:bg-white/10 dark:text-blue-300",
              index > current &&
                "border-gray-200 bg-white text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400",
            )}
          >
            {step.icon || index + 1}
          </span>
          <div
            className={cx(
              "min-w-0",
              compact
                ? "flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                : "space-y-1",
            )}
          >
            <span className="text-[15px] font-medium text-gray-900 dark:text-white">
              {step.title}
            </span>
            {step.description && (
              <span className="text-[15px] text-slate-500 dark:text-slate-400">
                {step.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function HorizontalStepList({
  steps,
  current = 0,
}: {
  steps: TrainingStep[];
  current?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
      {steps.map((step, index) => (
        <div key={step.key} className="flex min-w-0 items-start gap-3">
          <span
            className={cx(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-gray-600 dark:text-gray-300",
              index === current && "text-blue-600 dark:text-blue-300",
              index < current && "text-emerald-600 dark:text-emerald-300",
            )}
          >
            {step.icon || index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="whitespace-nowrap text-[15px] font-medium text-gray-900 dark:text-white">
                {step.title}
              </h3>
              {index < steps.length - 1 && (
                <div className="hidden h-px flex-1 bg-gray-200 dark:bg-white/10 lg:block" />
              )}
            </div>
            {step.description && (
              <p className="mt-1 max-w-40 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrainingProgressSteps({
  currentStep,
  status,
  experimentName,
  maxTrainingTime,
  elapsedTime = 0,
  onViewResults,
  currentSettingUpStep = 0,
  settingUpProgress = [],
}: TrainingProgressStepsProps) {
  const hasReachedTimeLimit =
    Boolean(maxTrainingTime) && elapsedTime >= Number(maxTrainingTime);

  const trainingSteps: TrainingStep[] = [
    {
      key: "selecting-instance",
      title: <span className="text-[var(--text)]">Selecting Instance</span>,
      icon:
        currentStep !== 0 ? (
          <DatabaseOutlined className="size-4 text-[var(--secondary-text)]" />
        ) : (
          <LoadingOutlined className="size-4 animate-spin text-[var(--secondary-text)]" />
        ),
      description: "Selecting suitable machine for you",
    },
    {
      key: "downloading-dependencies",
      title: (
        <span className="text-[var(--text)]">Downloading Dependencies</span>
      ),
      icon:
        currentStep !== 1 ? (
          <SettingOutlined className="size-4 text-[var(--secondary-text)]" />
        ) : (
          <LoadingOutlined className="size-4 animate-spin text-[var(--secondary-text)]" />
        ),
      description: "Setting up your machine",
    },
    {
      key: "downloading-data",
      title: <span className="text-[var(--text)]">Downloading Data</span>,
      icon:
        currentStep !== 2 ? (
          <CloudDownloadOutlined className="size-4 text-[var(--secondary-text)]" />
        ) : (
          <LoadingOutlined className="size-4 animate-spin text-[var(--secondary-text)]" />
        ),
      description: "Fetching data from cloud storage",
    },
    {
      key: "training",
      title: <span className="text-[var(--text)]">Training</span>,
      icon:
        currentStep !== 3 ? (
          <LineChartOutlined className="size-4 text-[var(--secondary-text)]" />
        ) : hasReachedTimeLimit ? (
          <CloseCircleOutlined className="size-4 text-red-500" />
        ) : (
          <LoadingOutlined className="size-4 animate-spin text-[var(--secondary-text)]" />
        ),
      description: "Preparing your model",
    },
    {
      key: "done",
      title: <span className="text-[var(--text)]">Done</span>,
      icon: (
        <CheckCircleOutlined className="size-4 text-[var(--secondary-text)]" />
      ),
      description: "Finished training your model",
    },
  ];

  const setupSteps = settingUpProgress.map((step, index) => ({
    ...step,
    key: step.key || `setup-step-${index}`,
    icon:
      index === currentSettingUpStep ? (
        <Spinner className="size-4" />
      ) : (
        step.icon || index + 1
      ),
  }));

  const alertText =
    experimentName === "loading"
      ? "Finding the best instance for your project. This may take a few moments..."
      : hasReachedTimeLimit
        ? "Training Time Limit Reached"
        : "This experiment may take a while. You can safely leave the page at any time, and we will automatically create your model once it is finished.";

  return (
    <div className="font-poppins">
      <div className="mb-7 flex items-center gap-2">
        <Rocket className="size-5 text-gray-700 dark:text-gray-200" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Training Preparation
        </h2>
      </div>

      <div className="mb-7">
        <HorizontalStepList current={currentStep} steps={trainingSteps} />
      </div>

      {status === "DONE" ? (
        <Alert className="rounded-xl border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
          <AlertDescription className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span>Your model has been trained and is ready for review.</span>
            <Button
              type="button"
              size="sm"
              onClick={onViewResults}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <CheckCircleOutlined className="size-4" />
              View Training Results
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert
          variant="default"
          className={cx(
            "mt-6 rounded-xl border px-3 py-2 font-poppins",
            hasReachedTimeLimit
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100"
              : "border-blue-300 bg-blue-50 text-gray-900 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-100",
          )}
        >
          <AlertDescription className="text-sm">{alertText}</AlertDescription>
          {hasReachedTimeLimit && (
            <AlertDescription className="mt-1 text-sm">
              The training has reached its maximum allocated time. It may
              automatically stop soon.
            </AlertDescription>
          )}
        </Alert>
      )}

      {currentStep === 1 && (
        <div className="mt-7 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-white/5">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
            <h3 className="m-0 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
              <SettingOutlined className="mr-2 size-5 text-gray-600 dark:text-gray-300" />
              Current Step Progress
            </h3>
          </div>
          <div className="px-5 py-5">
            <StepList current={currentSettingUpStep} steps={setupSteps} />
          </div>
        </div>
      )}
    </div>
  );
}
