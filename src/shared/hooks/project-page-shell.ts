import { cn } from "src/lib/utils";

const projectPageEdge = "w-full min-h-0 px-6 py-8";

/**
 * Standard page body inside {@link ProjectLayout} main (sidebar already provides outer padding).
 * No max-width — list and detail routes share the same left edge and content width.
 */
export const projectPageShellClass = cn(
  projectPageEdge,
  "bg-white text-gray-900 dark:bg-slate-950 dark:text-white",
);

/** Full-height scroll column (e.g. Deployments list). */
export const projectPageShellScrollClass = cn(
  "h-full overflow-y-auto",
  projectPageShellClass,
);

/** Deploy Model flow — gray canvas, same edge padding as other project pages. */
export const projectPageShellGrayScrollClass = cn(
  "h-full min-h-0 overflow-y-auto",
  projectPageEdge,
  "bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-white",
);

/** Vertical rhythm between major blocks (hero, cards, tables). */
export const projectPageStackClass = "flex w-full flex-col gap-6";
