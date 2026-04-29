import React from "react";
import { Clock, Sparkles } from "lucide-react";
import MarkdownRenderer from "@/src/features/projects/components/MarkdownRenderer";

const EmptyTaskPreview = () => (
  <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 text-center dark:border-white/10 dark:bg-white/5">
    <div>
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-200">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Select a task type
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose an option to see examples and training details.
      </p>
    </div>
  </div>
);

const ProjectTaskPreview = ({ task }) => {
  if (!task) return <EmptyTaskPreview />;

  return (
    <section className="min-w-0 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {task.subtitle}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-200">
          <Clock className="h-4 w-4" />
          {task.timeToTrain}
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/60">
          <img
            src={task.image}
            alt={task.title}
            className="aspect-[16/11] h-full max-h-[260px] w-full object-cover"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Best for
          </h4>
          <p className="mt-2 text-sm leading-6 break-words text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
          <div className="mt-4 inline-flex rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-200">
            {task.difficulty}
          </div>
        </div>
      </div>

      {task.explain && (
        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
          <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Explanation
          </h4>
          <div className="max-h-48 overflow-y-auto break-words pr-2 text-sm leading-6 text-slate-600 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin] dark:text-slate-300">
            <MarkdownRenderer markdownText={task.explain} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectTaskPreview;
