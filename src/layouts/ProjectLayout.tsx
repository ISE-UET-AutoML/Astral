import { Outlet, useMatches, useParams } from "react-router-dom";
import ProjectSidebar from "src/layouts/ProjectSidebar";

export default function ProjectLayout() {
  const params = useParams();
  const matches = useMatches();

  const defaultLayoutConfig = {
    overflow: "auto",
    padding: "default",
    height: "min",
    scrollAt: "card",
  };

  const layoutConfig = matches.reduce((config, match: any) => {
    if (!match.handle?.projectLayout) return config;
    return { ...config, ...match.handle.projectLayout };
  }, defaultLayoutConfig);

  const scrollAtShell = layoutConfig.scrollAt === "shell";

  const shellOverflowClass = scrollAtShell
    ? "overflow-y-auto overflow-x-hidden"
    : "overflow-y-auto overflow-x-hidden";

  return (
    <div className="relative h-screen bg-white dark:bg-slate-950">
      <ProjectSidebar
        projectID={params.id}
        className="shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
      />

      {/* Main content — starts exactly below the fixed navbar */}
      <div
        className={`absolute top-16 left-0 right-0 bottom-0 pl-[120px] lg:pl-[140px] ${shellOverflowClass}`}
      >
        <Outlet />
      </div>
    </div>
  );
}
