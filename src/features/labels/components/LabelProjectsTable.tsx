import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import { Cloud, Info, FolderOpen } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Spinner } from "src/components/ui/spinner";
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
  return (
    <div className="flex h-full w-full flex-col rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-t-2xl border-b border-gray-100 bg-blue-50/60 px-5 py-3.5 dark:border-white/10 dark:bg-blue-900/10">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Select a labeled project to use as training data. Projects without labels cannot be selected.
        </p>
      </div>

      <div className="flex-1 p-5">
        {tableLoading ? (
          <div className="flex min-h-52 items-center justify-center gap-3">
            <Spinner className="size-5 text-blue-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Processing label project creation…
            </span>
          </div>
        ) : hasProjects ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 dark:border-white/10">
                  <TableHead className="w-12 bg-gray-50/80 py-3 text-center font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300" />
                  <TableHead className="bg-gray-50/80 py-3 text-left font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                    Title
                  </TableHead>
                  <TableHead className="bg-gray-50/80 py-3 text-center font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                    Service
                  </TableHead>
                  <TableHead className="bg-gray-50/80 py-3 text-center font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                    Bucket
                  </TableHead>
                  <TableHead className="bg-gray-50/80 py-3 text-center font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                    Labeled
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-gray-500">
                        <Cloud className="size-10 opacity-40" />
                        <p className="text-sm">
                          No label projects match your current filters.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map((project) => (
                    <TableRow
                      key={project.project_id}
                      className={`border-b border-gray-100 transition-colors dark:border-white/10 ${
                        project.isLabeled
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
                          : "cursor-not-allowed opacity-50"
                      } ${
                        selectedRowKey === project.project_id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      onClick={() => {
                        if (project.isLabeled) onSelectRow(project.project_id);
                      }}
                    >
                      <TableCell className="py-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (project.isLabeled) onSelectRow(project.project_id);
                          }}
                          className={`inline-flex size-5 items-center justify-center rounded-full border transition-colors ${
                            project.isLabeled
                              ? selectedRowKey === project.project_id
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300 hover:border-blue-500 dark:border-gray-600 dark:hover:border-blue-400"
                              : "cursor-not-allowed border-gray-200 dark:border-gray-700"
                          }`}
                          aria-label={
                            selectedRowKey === project.project_id
                              ? "Selected"
                              : "Select label project"
                          }
                        >
                          {selectedRowKey === project.project_id && (
                            <span className="block size-2.5 rounded-full bg-white" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="py-4 font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        {renderServiceTag(project.service)}
                      </TableCell>
                      <TableCell className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {project.bucketName}
                      </TableCell>
                      <TableCell className="py-4 text-center">
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
                                No labeled data — cannot be selected
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
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
              <FolderOpen className="size-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                No label projects yet
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create a label project to get started.
              </p>
            </div>
            <Button
              onClick={onShowCreateDatasetModal}
              className="h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Create Label Project
            </Button>
          </div>
        )}
      </div>

      {hasProjects && (
        <div className="shrink-0 border-t border-gray-100 px-5 py-4 dark:border-white/10">
          <BuildPager
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
