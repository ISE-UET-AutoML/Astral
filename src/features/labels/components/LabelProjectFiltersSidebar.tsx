import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { CustomSelect, Option } from "src/components/ui/custom-select";
import { RadioGroup, RadioGroupItem } from "src/components/ui/radio-group";
import { Button } from "src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import {
  ArrowRight,
  Info,
  Sliders,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export function LabelProjectFiltersSidebar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
  serviceFilter,
  onServiceFilterChange,
  bucketFilter,
  onBucketFilterChange,
  labeledFilter,
  onLabeledFilterChange,
  selectedRowKey,
  onContinue,
}) {
  return (
    <Card className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-slate-900/50 h-full w-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white">
          <Sliders className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Filter Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-900 dark:text-white">
            Search by Name
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-gray-400 dark:text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>Search for projects by name</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 dark:border-white/20 dark:bg-white/10 dark:text-white"
            />
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-900 dark:text-white">
            Sort by
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-gray-400 dark:text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>Choose how to sort the projects</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1">
              <CustomSelect
                value={sortBy}
                onChange={onSortByChange}
                placeholder="Sort by"
                className="theme-dropdown w-full"
              >
                <Option value="name">Name</Option>
                <Option value="date">Date Added</Option>
              </CustomSelect>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onSortDirectionChange(
                        sortDirection === "asc" ? "desc" : "asc",
                      )
                    }
                    className="p-2 h-8 w-8 flex-shrink-0 border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Sort {sortDirection === "asc" ? "Ascending" : "Descending"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Cloud Service Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-900 dark:text-white">
            Cloud Service
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-gray-400 dark:text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  Choose the cloud storage service where your label project is
                  stored
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <CustomSelect
            value={serviceFilter}
            onChange={onServiceFilterChange}
            placeholder="Select Service"
            className="theme-dropdown"
          >
            <Option value="">All Services</Option>
            <Option value="AWS_S3">Amazon S3</Option>
            <Option value="GCP_STORAGE">Google Cloud Storage</Option>
          </CustomSelect>
        </div>

        {/* Storage Bucket Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-900 dark:text-white">
            Storage Bucket
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-gray-400 dark:text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  Select the specific storage bucket containing your label
                  project
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <CustomSelect
            value={bucketFilter}
            onChange={onBucketFilterChange}
            placeholder="Select Bucket"
            className="theme-dropdown"
          >
            <Option value="">All Buckets</Option>
            <Option value="user-private-project">User Private Project</Option>
            <Option value="bucket-1">Bucket 1</Option>
          </CustomSelect>
        </div>

        {/* Project Status Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-3 text-gray-900 dark:text-white">
            Project Status
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-help text-gray-400 dark:text-gray-500" />
                </TooltipTrigger>
                <TooltipContent>
                  Filter projects based on whether they're already labeled
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <RadioGroup
            value={labeledFilter}
            onValueChange={onLabeledFilterChange}
            className="space-y-3"
          >
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onLabeledFilterChange("")}
            >
              <RadioGroupItem value="" id="all" />
              <label
                htmlFor="all"
                className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
              >
                All Projects
              </label>
            </div>
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onLabeledFilterChange("yes")}
            >
              <RadioGroupItem value="yes" id="labeled" />
              <label
                htmlFor="labeled"
                className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
              >
                Labeled Projects
              </label>
            </div>
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onLabeledFilterChange("no")}
            >
              <RadioGroupItem value="no" id="unlabeled" />
              <label
                htmlFor="unlabeled"
                className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
              >
                Unlabeled Projects
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Continue Button */}
        {selectedRowKey && (
          <Button
            onClick={onContinue}
            className="w-full font-semibold py-5 px-4 rounded-xl transition bg-blue-600 hover:bg-blue-700 text-white"
          >
            <span className="flex items-center justify-center gap-2">
              Go to Training
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
