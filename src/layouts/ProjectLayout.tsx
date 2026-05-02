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

      {/* Main content — ml/mt match sidebar; horizontal padding so content isn’t flush to the sidebar edge */}
      <div className="ml-[120px] mt-[67px] flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-6 sm:px-8 lg:px-10">
        <Outlet />
      </div>
    </div>
  );
}
