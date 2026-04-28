import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Spinner } from "src/components/ui/spinner";
import {
  ChartLine as LineChartOutlined,
  CircleCheck as CheckCircleOutlined,
  CircleX as CloseCircleOutlined,
  CloudDownload as CloudDownloadOutlined,
  Database as DatabaseOutlined,
  LoaderCircle as LoadingOutlined,
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
}: {
  steps: TrainingStep[];
  current?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className={cx(
            "flex items-center gap-2 rounded-xl px-2 py-1.5",
            index <= current && "font-medium",
          )}
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-xs text-[var(--secondary-text)]">
            {step.icon || index + 1}
          </span>
          <span className="min-w-0 text-sm">{step.title}</span>
          {step.description && (
            <span className="hidden min-w-0 text-sm text-slate-400 sm:inline">
              {step.description}
            </span>
          )}
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
          <LoadingOutlined className="size-4 text-[var(--secondary-text)]" />
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
          <LoadingOutlined className="size-4 text-[var(--secondary-text)]" />
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
          <LoadingOutlined className="size-4 text-[var(--secondary-text)]" />
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
          <LoadingOutlined className="size-4 text-[var(--secondary-text)]" />
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

  return (
    <div className="flex w-full flex-col gap-6">
      <StepList current={currentStep} steps={trainingSteps} />

      {status === "DONE" ? (
        <div className="py-8 text-center">
          <div className="mb-4">
            <CheckCircleOutlined className="mb-4 text-[64px] text-[#10b981]" />
          </div>
          <h2 className="mb-2 font-poppins text-2xl font-semibold text-[var(--text)]">
            Training Completed Successfully!
          </h2>
          <p className="mb-6 font-poppins text-base text-[#94a3b8]">
            Your model has been trained and is ready for use. Click below to
            view the results and performance metrics.
          </p>
          <Button
            type="button"
            onClick={onViewResults}
            className="h-auto rounded-xl border-none bg-gradient-to-br from-[#3b82f6] to-[#22d3ee] px-8 py-3 font-poppins text-lg font-semibold shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <CheckCircleOutlined className="mr-2 size-5" />
            View Training Results
          </Button>
        </div>
      ) : (
        <Alert
          variant="default"
          className={cx(
            "rounded-xl border font-poppins",
            hasReachedTimeLimit
              ? "border-[rgba(251,191,36,0.3)] bg-[linear-gradient(135deg,rgba(251,191,36,0.1),rgba(245,158,11,0.1))]"
              : "border-[rgba(59,130,246,0.3)] bg-[linear-gradient(135deg,rgba(59,130,246,0.1),rgba(34,211,238,0.1))]",
          )}
        >
          <AlertTitle className="text-[var(--text)]">
            {experimentName === "loading"
              ? "Finding the best instance for your project. This may take a few moments..."
              : hasReachedTimeLimit
                ? "Training Time Limit Reached"
                : "This experiment may take a while. You can safely leave the page at any time, and we will automatically create your model once it is finished."}
          </AlertTitle>
          {hasReachedTimeLimit && (
            <AlertDescription className="text-[var(--text)]">
              The training has reached its maximum allocated time. It may
              automatically stop soon.
            </AlertDescription>
          )}
        </Alert>
      )}

      {currentStep === 1 && (
        <Card className="rounded-xl border border-[var(--border)] bg-[var(--card-gradient)] font-poppins shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="m-0 flex items-center text-xl font-semibold text-[var(--text)]">
              <SettingOutlined className="mr-2 size-5 text-[var(--secondary-text)]" />
              Setting Up Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StepList current={currentSettingUpStep} steps={setupSteps} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
