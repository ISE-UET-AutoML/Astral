import React from "react";
import { Check } from "lucide-react";

const ProjectTaskList = ({ tasks, selectedFlags, projectTypes, onSelect }) => {
  return (
    <section className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--filter-border)] bg-white/70 dark:bg-white/5">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h3 className="text-sm font-semibold text-[var(--title-project)]">
          Task type
        </h3>
        <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
          Pick the workflow that matches your dataset.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin]">
        <div className="grid gap-2">
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
                className={`flex min-h-[72px] w-full items-start gap-3 rounded-xl border p-3 text-left transition hover:border-blue-300 hover:bg-blue-50/70 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/10 ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 shadow-sm dark:bg-blue-500/15"
                    : "border-[var(--border)] bg-white/80 dark:bg-white/5"
                }`}
                aria-label={`Select ${task.title} task type`}
                aria-pressed={isSelected}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl dark:bg-white/10">
                  {task.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[var(--text)]">
                    {task.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[var(--secondary-text)]">
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
