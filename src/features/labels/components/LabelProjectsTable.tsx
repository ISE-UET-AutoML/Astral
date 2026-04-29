import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "src/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { Card, CardContent } from "src/components/ui/card";
import { Cloud, FolderPlus, Info } from "lucide-react";
import BuildPager from "src/features/project-build/pages/build/BuildPager";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";

export function LabelProjectsTable({
  tableLoading,
  hasProjects,
  filteredProjects,
  paginatedProjects,
  selectedRowKey,
  onSelectRow,
  renderServiceTag,
  renderLabeledTag,
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onShowCreateDatasetModal,
}) {
  const folderPlusGradientId = `folder-plus-grad-${useId().replace(/:/g, "")}`;

  return (
    <Card className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900/50 h-full w-full flex flex-col">
      <CardContent className="p-6 flex-1">
        <Alert className="mb-6 border border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10 rounded-xl">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="font-medium text-gray-900 dark:text-white">
            Need help choosing a label project?
          </AlertTitle>
          <AlertDescription className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            If you're unsure about which project to select, look for one that
            matches your task type and is already labeled (marked with 'Yes').
            This will help you get started faster.
          </AlertDescription>
        </Alert>

        {tableLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400 text-sm">
              Processing label project creation...
            </span>
          </div>
        ) : hasProjects ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-white/10">
                  <TableHead className="w-12 text-center py-4 bg-gray-50 dark:bg-slate-800 font-semibold text-gray-900 dark:text-white" />
                  <TableHead className="font-semibold text-left py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
                    Title
                  </TableHead>
                  <TableHead className="font-semibold text-center py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
                    Service
                  </TableHead>
                  <TableHead className="font-semibold text-center py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
                    Bucket
                  </TableHead>
                  <TableHead className="font-semibold text-center py-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white">
                    Labeled
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow className="border-b border-gray-200 dark:border-white/10">
                    <TableCell colSpan={5} className="text-center py-16">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Cloud className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-sm">
                          No label projects match your current filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map((project) => (
                    <TableRow
                      key={project.project_id}
                      className={`border-b border-gray-200 dark:border-white/10 transition-all duration-200 ${
                        project.isLabeled
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50"
                          : "opacity-50 cursor-not-allowed"
                      } ${
                        selectedRowKey === project.project_id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      onClick={() => {
                        if (project.isLabeled) {
                          onSelectRow(project.project_id);
                        }
                      }}
                    >
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (project.isLabeled) {
                              onSelectRow(project.project_id);
                            }
                          }}
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                            project.isLabeled
                              ? selectedRowKey === project.project_id
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-400 text-gray-400 hover:border-blue-600 dark:border-gray-500 dark:hover:border-blue-400"
                              : "border-gray-300 text-gray-300 cursor-not-allowed dark:border-gray-600"
                          }`}
                          aria-label={
                            selectedRowKey === project.project_id
                              ? "Selected label project"
                              : "Select label project"
                          }
                        >
                          {selectedRowKey === project.project_id && (
                            <span className="block h-2.5 w-2.5 rounded-full bg-white" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium py-4 text-gray-900 dark:text-white">
                        {project.title}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderServiceTag(project.service)}
                      </TableCell>
                      <TableCell className="text-center py-4 text-gray-600 dark:text-gray-400 text-sm">
                        {project.bucketName}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {project.isLabeled ? (
                          renderLabeledTag(project.isLabeled)
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  {renderLabeledTag(project.isLabeled)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                This project has no labeled data and cannot be
                                selected
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 select-none">
            <button
              type="button"
              onClick={onShowCreateDatasetModal}
              className="group relative flex items-center justify-center focus:outline-none cursor-pointer"
              aria-label="Create label project"
            >
              <span className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-400/10 scale-125 animate-ping [animation-duration:2.8s] group-hover:bg-blue-400/20" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/10 scale-110 blur-xl group-hover:scale-125 transition-transform duration-500" />
              <span className="relative flex items-center justify-center w-36 h-36 rounded-3xl bg-white dark:bg-[#1c1c24] shadow-[0_8px_40px_rgba(59,130,246,0.25)] dark:shadow-[0_8px_48px_rgba(59,130,246,0.18)] ring-1 ring-black/5 dark:ring-white/8 group-hover:-translate-y-2 group-hover:shadow-[0_20px_56px_rgba(59,130,246,0.38)] dark:group-hover:shadow-[0_20px_56px_rgba(59,130,246,0.3)] transition-all duration-300 ease-out">
                <svg width="0" height="0" className="absolute" aria-hidden>
                  <defs>
                    <linearGradient
                      id={folderPlusGradientId}
                      x1="0"
                      y1="12"
                      x2="24"
                      y2="12"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#0066CC" />
                      <stop offset="100%" stopColor="#29B6F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <FolderPlus
                  className="w-14 h-14 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-300"
                  stroke={`url(#${folderPlusGradientId})`}
                  strokeWidth={1.75}
                  fill="none"
                  aria-hidden
                />
              </span>
            </button>
            <div className="mt-6 text-center">
              <div className="text-gray-900 dark:text-white text-xl font-semibold">
                No Label Projects Yet
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Start by creating your Label Projects
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <div className="px-6 pb-6 pt-0 shrink-0 border-t border-gray-200 dark:border-white/10">
        <BuildPager
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </div>
    </Card>
  );
}
