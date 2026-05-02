import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "src/lib/utils";

type PageHeadingProps = {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  className?: string;
  iconClassName?: string;
};

/**
 * Page title row with lucide icon — gradient chip + tight tracking for AI product pages.
 */
export function PageHeading({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
}: PageHeadingProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/[0.14] via-violet-500/10 to-indigo-600/12 ring-1 ring-blue-500/20 shadow-sm dark:from-blue-400/20 dark:via-violet-500/15 dark:to-indigo-500/15 dark:ring-blue-400/30",
            iconClassName,
          )}
          aria-hidden
        >
          <Icon
            className="size-[1.35rem] text-blue-600 dark:text-blue-400"
            strokeWidth={1.65}
          />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          {description != null && description !== "" ? (
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
