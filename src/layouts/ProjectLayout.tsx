import { Outlet, useParams } from "react-router-dom";
import ProjectSidebar from "src/layouts/ProjectSidebar";

export default function ProjectLayout() {
  const params = useParams();

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950">
      <ProjectSidebar
        projectID={params.id}
        className="shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]"
      />

      {/* Main content — ml/mt match sidebar's fixed w-[120px] and top-[67px] */}
      <div className="ml-[120px] mt-[67px] flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
