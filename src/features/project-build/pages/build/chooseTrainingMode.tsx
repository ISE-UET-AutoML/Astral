import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Check, HeartHandshake, Scale, Zap } from "lucide-react";
import { Badge } from "src/components/ui/badge";
import { TRAINING_MODE_TAGS } from "src/constants/clouldInstance";

const MODES = {
  autogluon: {
    title: "AutoGluon",
    badge: "AUTOGLUON",
    badgeVariant: "outline",
    description:
      "Train with the core AutoGluon pipeline. This keeps the standard single-experiment flow and uses AutoGluon defaults for cloud training.",
    iconBoxClass:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-white dark:border-white/20",
    buttonClass:
      "relative w-full py-2.5 px-6 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors dark:text-white dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/20",
  },
  iml: {
    title: "iML",
    badge: "IML",
    badgeVariant: "outline",
    description:
      "Train with the iML pipeline. This also runs as a single experiment, but routes training through the iML-backed flow.",
    iconBoxClass:
      "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-400/40",
    buttonClass:
      "relative w-full py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 border border-blue-700 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700",
  },
};

function ModeCardLarge({ spec, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`group text-left h-full w-full max-w-xl mx-auto flex flex-col gap-6 sm:gap-7 md:gap-8 rounded-2xl border bg-white p-8 sm:p-10 md:p-12 min-h-[min(440px,72vh)] lg:min-h-[460px] transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-slate-900 dark:focus-visible:ring-offset-slate-950 ${
        selected
          ? "border-blue-400 ring-2 ring-blue-500/30"
          : "border-gray-200 dark:border-white/10"
      }`}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
        {spec.title}
      </h2>

      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300 flex-1">
        {spec.description}
      </p>

      <div
        className={`${spec.buttonClass} mt-auto flex w-full shrink-0 items-center`}
      >
        <span className="w-full text-center pr-9 sm:pr-10">
          {selected ? "SELECTED" : "SELECT"}
        </span>
        <span className="pointer-events-none absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center sm:right-5">
          {selected ? (
            <Check
              className="h-[1.125rem] w-[1.125rem]"
              strokeWidth={2.5}
              aria-hidden
            />
          ) : (
            spec.buttonSuffix
          )}
        </span>
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
        ? selectedTags.filter((value) => value !== tag)
        : [...selectedTags, tag],
    });
  };

  const handleContinue = () => {
    if (!projectInfo?.id || selectedTags.length === 0) return;
    navigate(`/app/project/${projectInfo.id}/build/selectInstance`);
  };

  return (
    <>
      <div className="min-h-full overflow-y-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 sm:mb-14 md:mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Choose training mode
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl">
              Select one or more training pipelines for this run. Each selected
              method starts its own experiment and its own cloud instance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch mb-8">
            <ModeCardLarge
              spec={MODES.autogluon}
              selected={selectedTags.includes(TRAINING_MODE_TAGS.autogluon)}
              onToggle={() => toggleTag(TRAINING_MODE_TAGS.autogluon)}
            />
            <ModeCardLarge
              spec={MODES.iml}
              selected={selectedTags.includes(TRAINING_MODE_TAGS.iml)}
              onToggle={() => toggleTag(TRAINING_MODE_TAGS.iml)}
            />
          </div>

          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={handleContinue}
              disabled={selectedTags.length === 0}
              className="inline-flex min-w-[280px] items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
            >
              {selectedTags.length === 0
                ? "Select at least one method"
                : `Continue with ${selectedTags.length} method${selectedTags.length > 1 ? "s" : ""}`}
            </button>
          </div>

          <div className="flex justify-center px-4">
            <p
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2.5 text-center text-xs text-gray-500 dark:text-gray-500"
              role="note"
            >
              <HeartHandshake
                className="h-4 w-4 shrink-0"
                strokeWidth={1.5}
                aria-hidden
              />
              <span>
                We have fully integrated the partner system into the Astral
                ecosystem as a native component.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChooseTrainingMode;
