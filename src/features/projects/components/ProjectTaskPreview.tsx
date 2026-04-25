import React from "react";
import { Clock } from "lucide-react";
import MarkdownRenderer from "src/components/shared/utilities/MarkdownRenderer";

const EmptyTaskPreview = () => (
  <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-white/60 text-center dark:bg-white/5">
    <div>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl dark:bg-blue-500/15">
        🎯
      </div>
      <h3 className="text-base font-semibold text-[var(--text)]">
        Select a task type
      </h3>
      <p className="mt-1 text-sm text-[var(--secondary-text)]">
        Choose an option to see examples and training details.
      </p>
    </div>
  </div>
);

const ProjectTaskPreview = ({ task }) => {
  if (!task) return <EmptyTaskPreview />;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-white/80 p-4 dark:bg-white/5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-[var(--text)]">{task.title}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--secondary-text)]">
            {task.subtitle}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-200">
          <Clock className="h-4 w-4" />
          {task.timeToTrain}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--filter-bg)]">
          <img
            src={task.image}
            alt={task.title}
            className="aspect-[16/11] h-full max-h-[260px] w-full object-cover"
          />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white/70 p-4 dark:bg-black/10">
          <h4 className="text-sm font-semibold text-[var(--text)]">Best for</h4>
          <p className="mt-2 text-sm leading-6 text-[var(--secondary-text)]">
            {task.description}
          </p>
          <div className="mt-4 inline-flex rounded-xl border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:text-blue-200">
            {task.difficulty}
          </div>
        </div>
      </div>

      {task.explain && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-white/70 p-4 dark:bg-black/10">
          <h4 className="mb-3 text-sm font-semibold text-[var(--text)]">
            Explanation
          </h4>
          <div className="max-h-48 overflow-y-auto pr-2 text-sm leading-6 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin]">
            <MarkdownRenderer markdownText={task.explain} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectTaskPreview;
