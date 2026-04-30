import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Check, ArrowRight, Zap, Network } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { TRAINING_MODE_TAGS } from "src/constants/clouldInstance";

const MODES = [
  {
    key: TRAINING_MODE_TAGS.autogluon,
    title: "AutoGluon",
    badge: "AutoGluon",
    description:
      "Train with the core AutoGluon pipeline. Uses AutoGluon defaults for cloud training with a standard single-experiment flow.",
    Icon: Zap,
  },
  {
    key: TRAINING_MODE_TAGS.iml,
    title: "iML",
    badge: "iML",
    description:
      "Train with the iML pipeline. Runs as a single experiment routed through the iML-backed training flow.",
    Icon: Network,
  },
];

function ModeCard({ mode, selected, onToggle }) {
  const { title, badge, description, Icon } = mode;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`group flex flex-col gap-5 rounded-2xl border bg-white p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:focus-visible:ring-offset-slate-950 ${
        selected
          ? "border-blue-400 shadow-sm ring-2 ring-blue-500/20"
          : "border-gray-200 dark:border-white/10"
      }`}
    >
      {/* Icon + badge row */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            selected
              ? "border-blue-200 bg-blue-50 dark:border-blue-400/30 dark:bg-blue-500/15"
              : "border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"
          }`}
        >
          <Icon
            className={`size-5 ${selected ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
          />
        </div>
        <Badge
          className={
            selected
              ? "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
              : "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:bg-white/10 dark:text-gray-400"
          }
        >
          {badge}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Selected indicator */}
      <div className="mt-auto">
        <div
          className={`flex h-9 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors ${
            selected
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "border border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
          }`}
        >
          {selected && <Check className="size-4" strokeWidth={2.5} />}
          <span>{selected ? "Selected" : "Select"}</span>
        </div>
      </div>
    </button>
  );
}

const ChooseTrainingMode = () => {
  const navigate = useNavigate();
  const {
    projectInfo,
    updateFields,
    selectedProject,
    trainingTags = [],
  } = useOutletContext();
  const selectedTags = Array.isArray(trainingTags) ? trainingTags : [];

  useEffect(() => {
    if (!projectInfo?.id) return;
    if (!selectedProject?.dataset_id) {
      navigate(`/app/project/${projectInfo.id}/build/uploadData`, {
        replace: true,
      });
    }
  }, [projectInfo?.id, selectedProject, navigate]);

  const toggleTag = (tag) => {
    updateFields({
      trainingTags: selectedTags.includes(tag)
        ? selectedTags.filter((v) => v !== tag)
        : [...selectedTags, tag],
    });
  };

  const handleContinue = () => {
    if (!projectInfo?.id || selectedTags.length === 0) return;
    navigate(`/app/project/${projectInfo.id}/build/selectInstance`);
  };

  return (
    <div className="flex w-full flex-col items-center px-6 py-12">
      {/* Page Header — centered */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Choose Training Mode
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          Select one or more training pipelines. Each method starts its own
          experiment and cloud instance.
        </p>
      </div>

      {/* Mode Cards — centered, side by side */}
      <div className="mb-8 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {MODES.map((mode) => (
          <ModeCard
            key={mode.key}
            mode={mode}
            selected={selectedTags.includes(mode.key)}
            onToggle={() => toggleTag(mode.key)}
          />
        ))}
      </div>

      {/* Continue — centered */}
      <Button
        onClick={handleContinue}
        disabled={selectedTags.length === 0}
        className="h-10 min-w-[260px] rounded-xl bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-white/10 dark:disabled:text-gray-500"
      >
        {selectedTags.length === 0
          ? "Select at least one method"
          : `Continue with ${selectedTags.length} method${selectedTags.length > 1 ? "s" : ""}`}
        {selectedTags.length > 0 && <ArrowRight className="size-4" />}
      </Button>
    </div>
  );
};

export default ChooseTrainingMode;
