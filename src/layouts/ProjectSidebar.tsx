import {
  AppWindow,
  BrainCircuit,
  ClipboardList,
  Hammer,
  Info,
  Rocket,
} from "lucide-react";
import clsx from "clsx";
import { PATHS } from "src/constants/paths";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ProjectSidebar = ({ projectID, className }) => {
  const location = useLocation();
  const projectBasePath = `/app/project/${projectID}`;
  const projectPathname = location.pathname.startsWith(`${projectBasePath}/`)
    ? location.pathname.slice(projectBasePath.length)
    : location.pathname;

  const isSectionActive = (section) =>
    projectPathname === `/${section}` ||
    projectPathname.startsWith(`/${section}/`);
  const isModelActive =
    isSectionActive("model") || projectPathname === "/build/deployView";
  const isDeployActive =
    isSectionActive("deploy") || projectPathname === "/build/deploySettingUp";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const navigation = [
    {
      name: "Info",
      href: PATHS.PROJECT_INFO(projectID),
      icon: Info,
      isActive: projectPathname === "/build/info",
    },
    {
      name: "Build",
      href: PATHS.PROJECT_BUILD(projectID),
      icon: Hammer,
      isActive:
        isSectionActive("build") &&
        projectPathname !== "/build/info" &&
        !isModelActive &&
        !isDeployActive,
    },
    {
      name: "Experiment",
      href: PATHS.PROJECT_EXPERIMENT(projectID),
      icon: ClipboardList,
      isActive: isSectionActive("experiments"),
    },
    {
      name: "Model",
      href: PATHS.PROJECT_MODEL(projectID),
      icon: BrainCircuit,
      isActive: isModelActive,
    },
    {
      name: "Deploy",
      href: PATHS.PROJECT_DEPLOY(projectID),
      icon: Rocket,
      isActive: isDeployActive,
    },
    {
      name: "My Apps",
      href: PATHS.PROJECT_MY_APPS(projectID),
      icon: AppWindow,
      isActive: isSectionActive("my-apps"),
    },
  ];

  return (
    <div
      className={clsx(
        "bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/10 z-50",
        "w-[120px] fixed top-[67px] left-0 bottom-0 h-[calc(100vh-60px)] overflow-hidden",
        "duration-300",
        className,
      )}
    >
      <div className="flex h-full min-h-0 flex-col px-2 py-4">
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="flex w-full flex-col gap-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={() =>
                  clsx(
                    "group flex min-h-[70px] w-full flex-col items-center justify-center text-xs font-medium",
                    "relative rounded-xl border py-2.5 transition-all duration-300",
                    item.isActive
                      ? "border-blue-200 bg-blue-50 text-blue-600 shadow-sm dark:border-white/40 dark:bg-white/15 dark:text-white dark:shadow-[0_0_12px_rgba(255,255,255,0.08)]"
                      : "border-transparent text-gray-500 hover:bg-gray-100/50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200",
                  )
                }
              >
                {() => (
                  <>
                    <div className="flex justify-center w-full">
                      <item.icon
                        className={clsx(
                          "mb-1.5 h-6 w-6 flex-shrink-0 transition-all duration-300",
                          item.isActive
                            ? "text-blue-600 dark:text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:scale-110",
                        )}
                      />
                    </div>
                    <span
                      className={clsx(
                        "block w-full text-center text-[11px] font-medium leading-tight transition-all duration-300",
                        item.isActive
                          ? "text-blue-600 dark:text-white font-semibold"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200",
                      )}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
