import { Check } from "lucide-react";

const ProjectTaskList = ({ tasks, selectedFlags, projectTypes, onSelect }) => {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-slate-900">
      <div className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Task type
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                className={`flex min-h-[80px] min-w-0 w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 hover:border-blue-300 hover:bg-blue-50/70 dark:hover:border-blue-400/50 dark:hover:bg-blue-500/10 ${
                  isSelected
                    ? "border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-200/70 dark:border-blue-500/50 dark:bg-blue-500/15 dark:ring-blue-400/20"
                    : "border-gray-200 bg-white dark:border-white/10 dark:bg-slate-800"
                }`}
                aria-label={`Select ${task.title} task type`}
                aria-pressed={isSelected}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  }`}
                >
                  {task.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {task.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {task.subtitle}
                  </span>
                </span>
                {isSelected && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="size-3" />
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
