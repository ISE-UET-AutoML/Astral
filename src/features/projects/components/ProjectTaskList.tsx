import React from "react";
import { Check } from "lucide-react";

const ProjectTaskList = ({ tasks, selectedFlags, projectTypes, onSelect }) => {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80 dark:border-white/10 dark:bg-white/5">
      <div className="border-b border-slate-200/80 px-5 py-4 dark:border-white/10">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Task type
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Pick the workflow that matches your dataset.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin]">
        <div className="grid gap-3">
          {tasks.map((task) => {
            const projectTypeIndex = projectTypes.findIndex(
              (type) => type === task.id,
            );
            const isSelected = selectedFlags && selectedFlags[projectTypeIndex];

            return (
              <button
                key={task.id}
                type="button"
                onClick={(event) => onSelect(event, projectTypeIndex)}
                className={`flex min-h-[84px] min-w-0 w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/70 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/10 ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-200/70 dark:bg-blue-500/15 dark:ring-blue-400/20"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/60"
                }`}
                aria-label={`Select ${task.title} task type`}
                aria-pressed={isSelected}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200"
                      : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                  }`}
                >
                  {task.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                    {task.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {task.subtitle}
                  </span>
                </span>
                {isSelected && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectTaskList;
