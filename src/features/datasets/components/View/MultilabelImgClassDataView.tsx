import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  FileImage as FileImageOutlined,
  Filter as FilterOutlined,
  Grid3x3,
  Menu as BarsOutlined,
  RefreshCw as ReloadOutlined,
  Tags as TagsOutlined,
  X,
} from "lucide-react";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "src/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "src/components/ui/empty";
import { Input } from "src/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "src/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";

type DatasetFile = {
  fileName: string;
  content?: string;
};

type MultilabelImgClassDataViewProps = {
  dataset?: {
    title?: string;
  };
  files?: DatasetFile[];
};

const imagesPerPage = 16;
const labelCountOptions = [
  { label: "All", value: "all" },
  { label: "2 Labels", value: "2" },
  { label: "3 Labels", value: "3" },
  { label: "4+ Labels", value: "4+" },
];

const getLabelsFromFileName = (fileName: string) => {
  const parts = fileName.split("/");
  return parts.slice(0, parts.length - 1);
};

const getIdFromFileName = (fileName: string) => {
  const parts = fileName.split("/");
  return parts[parts.length - 1];
};

function LabelMultiSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const toggleLabel = (label: string) => {
    onChange(
      value.includes(label)
        ? value.filter((item) => item !== label)
        : [...value, label],
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-between rounded-xl border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-left font-normal text-[var(--input-color)]"
        >
          <span className="min-w-0 truncate">
            {value.length > 0
              ? `${value.length} label${value.length === 1 ? "" : "s"} selected`
              : "Select labels to filter"}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--secondary-text)]" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-2">
        {options.length > 0 ? (
          <div className="max-h-72 overflow-y-auto">
            {options.map((label) => {
              const checked = value.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleLabel(label)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-[var(--text)] transition hover:bg-[var(--hover-bg)]"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--input-border)]">
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-2 py-6 text-center text-sm text-[var(--secondary-text)]">
            No labels available
          </div>
        )}
        {value.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="mt-2 w-full"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

function LabelBadges({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <Badge key={label} variant="secondary" className="max-w-full">
          <span className="truncate">{label}</span>
        </Badge>
      ))}
    </div>
  );
}

export default function MultilabelImgClassDataView({
  dataset,
  files = [],
}: MultilabelImgClassDataViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [labelCountFilter, setLabelCountFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<DatasetFile | null>(null);

  const availableLabels = useMemo(() => {
    const labels = new Set<string>();
    files.forEach((file) => {
      getLabelsFromFileName(file.fileName).forEach((label) =>
        labels.add(label),
      );
    });
    return Array.from(labels).sort((a, b) => a.localeCompare(b));
  }, [files]);

  const filteredFiles = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    return files.filter((file) => {
      const labels = getLabelsFromFileName(file.fileName);
      const labelCount = labels.length;
      const matchesLabels =
        selectedLabels.length === 0 ||
        selectedLabels.every((label) => labels.includes(label));
      const matchesSearch =
        !normalizedSearch ||
        file.fileName.toLowerCase().includes(normalizedSearch);
      const matchesCount =
        labelCountFilter === "all" ||
        (labelCountFilter === "4+"
          ? labelCount >= 4
          : labelCount === Number(labelCountFilter));

      return matchesLabels && matchesSearch && matchesCount;
    });
  }, [files, labelCountFilter, searchText, selectedLabels]);

  useEffect(() => {
    setCurrentPage(1);
  }, [labelCountFilter, searchText, selectedLabels]);

  const totalFiles = filteredFiles.length;
  const totalPages = Math.max(1, Math.ceil(totalFiles / imagesPerPage));
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = Math.min(startIndex + imagesPerPage, totalFiles);
  const currentFiles = filteredFiles.slice(startIndex, endIndex);

  const handleReset = () => {
    setSelectedLabels([]);
    setSearchText("");
    setLabelCountFilter("all");
  };

  return (
    <TooltipProvider>
      <div className="space-y-4 p-3 text-[var(--text)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              {dataset?.title || "Multilabel Dataset"}
            </h1>
            <p className="mt-1 text-sm text-[var(--secondary-text)]">
              Showing {totalFiles > 0 ? startIndex + 1 : 0}-{endIndex} of{" "}
              {totalFiles} results
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              <ReloadOutlined className="h-4 w-4" />
              Reset Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setViewMode((mode) => (mode === "grid" ? "list" : "grid"))
              }
            >
              {viewMode === "grid" ? (
                <BarsOutlined className="h-4 w-4" />
              ) : (
                <Grid3x3 className="h-4 w-4" />
              )}
              {viewMode === "grid" ? "List View" : "Grid View"}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="grid gap-4 pt-0 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr]">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--form-label-color)]">
                <FilterOutlined className="h-4 w-4" />
                Labels
              </label>
              <LabelMultiSelect
                options={availableLabels}
                value={selectedLabels}
                onChange={setSelectedLabels}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--form-label-color)]">
                <TagsOutlined className="h-4 w-4" />
                Label Count
              </label>
              <RadioGroup
                value={labelCountFilter}
                onValueChange={setLabelCountFilter}
                className="grid grid-cols-2 gap-2"
              >
                {labelCountOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-color)]"
                  >
                    <RadioGroupItem value={option.value} />
                    {option.label}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--form-label-color)]">
                <FilterOutlined className="h-4 w-4" />
                Search
              </label>
              <Input
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search by filename"
                className="h-10 rounded-xl border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-color)]"
              />
            </div>
          </CardContent>
        </Card>

        {currentFiles.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentFiles.map((file) => {
                const labels = getLabelsFromFileName(file.fileName);
                const id = getIdFromFileName(file.fileName);
                return (
                  <Card key={file.fileName} className="min-h-[320px]">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(file)}
                      className="flex h-48 items-center justify-center overflow-hidden bg-[var(--upload-bg)]"
                    >
                      {file.content ? (
                        <img
                          alt={id}
                          src={file.content}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <FileImageOutlined className="h-12 w-12 text-[var(--secondary-text)]" />
                      )}
                    </button>
                    <CardHeader className="gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="min-w-0 truncate">{id}</CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline">
                              <TagsOutlined className="h-3 w-3" />
                              {labels.length}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {labels.length} labels
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <LabelBadges labels={labels} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {currentFiles.map((file) => {
                const labels = getLabelsFromFileName(file.fileName);
                const id = getIdFromFileName(file.fileName);
                return (
                  <Card key={file.fileName}>
                    <CardContent className="grid gap-4 pt-0 sm:grid-cols-[140px_1fr]">
                      <button
                        type="button"
                        onClick={() => setSelectedImage(file)}
                        className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-[var(--upload-bg)]"
                      >
                        {file.content ? (
                          <img
                            alt={id}
                            src={file.content}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <FileImageOutlined className="h-10 w-10 text-[var(--secondary-text)]" />
                        )}
                      </button>
                      <div className="min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="truncate text-base font-semibold">
                            {id}
                          </h2>
                          <Badge variant="outline">
                            <TagsOutlined className="h-3 w-3" />
                            {labels.length}
                          </Badge>
                        </div>
                        <LabelBadges labels={labels} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        ) : (
          <Empty className="min-h-[260px] border border-dashed border-[var(--border)]">
            <EmptyMedia variant="icon">
              <Grid3x3 className="h-4 w-4" />
            </EmptyMedia>
            <EmptyTitle>No matching data found</EmptyTitle>
            <EmptyDescription>
              Adjust the filters or search term.
            </EmptyDescription>
          </Empty>
        )}

        {totalFiles > imagesPerPage && (
          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-[var(--secondary-text)]">
              {currentPage} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </Button>
          </div>
        )}

        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => {
            if (!open) setSelectedImage(null);
          }}
        >
          <DialogContent className="max-w-4xl p-3">
            <DialogTitle className="sr-only">
              {selectedImage
                ? getIdFromFileName(selectedImage.fileName)
                : "Dataset image"}
            </DialogTitle>
            {selectedImage?.content && (
              <img
                src={selectedImage.content}
                alt={getIdFromFileName(selectedImage.fileName)}
                className="max-h-[80vh] w-full object-contain"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
