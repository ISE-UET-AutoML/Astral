import { Clock, Sparkles } from "lucide-react";
import MarkdownRenderer from "@/src/features/projects/components/MarkdownRenderer";

const EmptyTaskPreview = () => (
  <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center dark:border-white/10 dark:bg-slate-900">
    <div>
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
        <Sparkles className="size-7" />
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Select a task type
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Choose an option to see examples and training details.
      </p>
    </div>
  </div>
);

const ProjectTaskPreview = ({ task }) => {
  if (!task) return <EmptyTaskPreview />;

  return (
    <section className="min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-slate-900">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            {task.subtitle}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-300">
          <Clock className="size-3.5" />
          {task.timeToTrain}
        </div>
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-800">
          <img
            src={task.image}
            alt={task.title}
            className="aspect-[16/11] h-full max-h-[260px] w-full object-cover"
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Best for
          </h4>
          <p className="mt-2 break-words text-sm leading-6 text-gray-500 dark:text-gray-400">
            {task.description}
          </p>
          <div className="mt-4 inline-flex rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300">
            {task.difficulty}
          </div>
        </div>
      </div>

      {task.explain && (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-800">
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Explanation
          </h4>
          <div className="max-h-48 overflow-y-auto break-words pr-2 text-sm leading-6 text-gray-600 [scrollbar-color:#94a3b8_transparent] [scrollbar-width:thin] dark:text-gray-300">
            <MarkdownRenderer markdownText={task.explain} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectTaskPreview;
