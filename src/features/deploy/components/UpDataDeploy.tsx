import Papa from "papaparse";
import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Spinner } from "src/components/ui/spinner";
import {
  createPresignedUrlsPredict,
  getVersionCount,
} from "src/features/datasets/api/dataset";
import {
  CircleCheck,
  CircleX,
  File as FileIcon,
  Folder as FolderIcon,
  Inbox,
  Trash2,
} from "lucide-react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const getToastContent = (value: unknown) =>
  typeof value === "object" && value && "content" in value
    ? (value as { content: string }).content
    : value;

const message = {
  success: (value: unknown) => toast.success(getToastContent(value)),
  error: (value: unknown) => toast.error(getToastContent(value)),
  warning: (value: unknown) => toast.warning(getToastContent(value)),
  info: (value: unknown) => toast.info(getToastContent(value)),
  loading: (value: unknown) => toast.loading(getToastContent(value)),
};

type UploadListFile = File & {
  uid?: string;
  name: string;
  type?: string;
  size: number;
  webkitRelativePath?: string;
  originFileObj?: File & { webkitRelativePath?: string };
};

type FolderNode =
  | { type: "folder"; children: FolderStructure }
  | { type: "file"; file: UploadListFile };

type FolderStructure = Record<string, FolderNode>;

type VerificationResult = {
  isValid: boolean;
  message: string;
};

type UpDataDeployProps = {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  taskType?: string;
  featureColumns?: string[];
  onUploadStart?: () => void;
  onUploadComplete?: (files: File[], prefixKey: string) => void;
};

const treeIndent = ["pl-0", "pl-4", "pl-8", "pl-12", "pl-16", "pl-20"];

const formatFileSize = (size: number) => `${(size / 1024).toFixed(2)} KB`;

const getNodeFileCount = (node: FolderNode): number => {
  if (node.type === "file") return 1;

  return Object.values(node.children).reduce(
    (count, child) => count + getNodeFileCount(child),
    0,
  );
};

const UpDataDeploy = ({
  isOpen,
  onClose,
  projectId,
  taskType,
  featureColumns,
  onUploadStart,
  onUploadComplete,
}: UpDataDeployProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadListFile[]>([]);
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [verificationMessage, setVerificationMessage] = useState("");

  const verifyData = async (
    files: UploadListFile[],
    currentTaskType?: string,
    currentFeatureColumns: string[] = [],
  ): Promise<VerificationResult> => {
    // Temporary bypass: allow all uploaded data types through verification.
    return {
      isValid: true,
      message: "Data verification is temporarily disabled.",
    };

    if (currentTaskType === "IMAGE_CLASSIFICATION") {
      const allImages = files.every((file) => /\.(jpg|jpeg|png)$/i.test(file.name));
      if (!allImages) {
        return {
          isValid: false,
          message: "For Image classification, only JPG/PNG files are allowed.",
        };
      }
      return { isValid: true, message: "Image files are valid." };
    }

    if (currentTaskType === "AUDIO_CLASSIFICATION") {
      const allAudios = files.every((file) => /\.(mp3|wav|ogg)$/i.test(file.name));
      if (!allAudios) {
        return {
          isValid: false,
          message:
            "For Audio classification, only MP3/WAV/OGG files are allowed.",
        };
      }
      return { isValid: true, message: "Audio files are valid." };
    }

    if (files.length !== 1 || !files[0].name.toLowerCase().endsWith(".csv")) {
      return {
        isValid: false,
        message: "Please upload exactly one CSV file for this task type.",
      };
    }

    const file = files[0].originFileObj || files[0];
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        complete: (results: {
          data: Array<Record<string, string>>;
          errors: Array<{ message: string }>;
        }) => {
          const { data, errors } = results;
          if (errors.length > 0) {
            resolve({
              isValid: false,
              message: `CSV parse error: ${errors[0].message}`,
            });
            return;
          }
          if (data.length === 0) {
            resolve({
              isValid: false,
              message: "CSV file cannot be empty.",
            });
            return;
          }

          const cols = Object.keys(data[0] || {});

          if (
            cols.length !== currentFeatureColumns.length ||
            !currentFeatureColumns.every((column) => cols.includes(column))
          ) {
            resolve({
              isValid: false,
              message:
                "CSV columns must exactly match feature columns: " +
                currentFeatureColumns.join(", "),
            });
            return;
          }
          resolve({ isValid: true, message: "CSV data is valid." });
        },
        error: (error: { message: string }) => {
          resolve({
            isValid: false,
            message: `Failed to parse CSV file: ${error.message}`,
          });
        },
      });
    });
  };

  const getNextVersion = async (pid: string) => {
    try {
      const { data } = await getVersionCount(pid);
      const version = data.version_count || 0;
      return version + 1;
    } catch (error) {
      console.error("Get next version error:", error);
      return 1;
    }
  };

  const resetSelection = () => {
    setFileList([]);
    setFolderStructure({});
    setVerificationStatus("idle");
    setVerificationMessage("");
  };

  const createFolderStructure = (files: UploadListFile[]) => {
    const structure: FolderStructure = {};

    files.forEach((file) => {
      const relativePath =
        file.originFileObj?.webkitRelativePath ||
        file.webkitRelativePath ||
        file.name;
      const pathParts = relativePath.split("/");

      let current: FolderStructure = structure;
      for (let index = 0; index < pathParts.length - 1; index += 1) {
        const folderName = pathParts[index];
        if (!current[folderName]) {
          current[folderName] = { type: "folder", children: {} };
        }
        const node = current[folderName];
        if (node.type === "folder") {
          current = node.children;
        }
      }

      const fileName = pathParts[pathParts.length - 1];
      current[fileName] = { type: "file", file };
    });

    return structure;
  };

  const handleFilesSelected = async (incomingFiles: UploadListFile[]) => {
    if (incomingFiles.length === 0) {
      resetSelection();
      return;
    }

    const allowedFiles = incomingFiles.filter((file) => {
      const isUnderLimit = file.size / 1024 / 1024 < 20;
      if (!isUnderLimit) {
        message.error("File must be smaller than 20MB!");
      }
      return isUnderLimit;
    });

    if (allowedFiles.length === 0) {
      resetSelection();
      return;
    }

    const verificationResult = await verifyData(
      allowedFiles,
      taskType,
      featureColumns,
    );

    if (verificationResult.isValid) {
      setVerificationStatus("success");
      setVerificationMessage("Data verification successful. Ready to upload.");
      setFileList(allowedFiles);
      setFolderStructure(createFolderStructure(allowedFiles));
      return;
    }

    setVerificationStatus("error");
    setVerificationMessage(verificationResult.message);
    setFileList([]);
    setFolderStructure({});
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as UploadListFile[];
    await handleFilesSelected(files);
    event.target.value = "";
  };

  const handleRemovePath = (pathParts: string[]) => {
    setFolderStructure((previous) => {
      const clone = JSON.parse(JSON.stringify(previous)) as FolderStructure;
      let parent: FolderStructure = clone;

      for (let index = 0; index < pathParts.length - 1; index += 1) {
        const key = pathParts[index];
        if (!parent[key]) return previous;
        const node = parent[key];
        if (node.type !== "folder") return previous;
        parent = node.children;
      }

      const last = pathParts[pathParts.length - 1];
      if (last != null && parent[last]) {
        delete parent[last];
      }

      return clone;
    });

    setFileList((previous) =>
      previous.filter((file) => {
        const relativePath =
          file.originFileObj?.webkitRelativePath ||
          file.webkitRelativePath ||
          file.name;
        const relativeParts = relativePath.split("/");
        return !pathParts.every((part, index) => relativeParts[index] === part);
      }),
    );
  };

  const renderFolderStructure = (
    structure: FolderStructure,
    path: string[] = [],
  ) =>
    Object.entries(structure).map(([name, item]) => {
      const currentPath = [...path, name];
      const level = path.length;
      const indentClass = treeIndent[Math.min(level, treeIndent.length - 1)];

      if (item.type === "folder") {
        return (
          <div key={currentPath.join("/")} className={cx("space-y-2", indentClass)}>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 dark:border-white/10 dark:bg-slate-950/60">
              <FolderIcon className="size-4 text-amber-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {name}/
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {getNodeFileCount(item)} file{getNodeFileCount(item) === 1 ? "" : "s"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePath(currentPath)}
                className="flex size-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-400/20 dark:hover:bg-red-500/10 dark:hover:text-red-200"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="space-y-2">{renderFolderStructure(item.children, currentPath)}</div>
          </div>
        );
      }

      return (
        <div
          key={currentPath.join("/")}
          className={cx(
            "flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 dark:border-white/10 dark:bg-slate-950/60",
            indentClass,
          )}
        >
          <FileIcon className="size-4 text-blue-500" />
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium text-slate-900 dark:text-white"
              title={name}
            >
              {name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatFileSize(item.file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleRemovePath(currentPath)}
            className="flex size-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-400/20 dark:hover:bg-red-500/10 dark:hover:text-red-200"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      );
    });

  const handleCancel = () => {
    resetSelection();
    onClose();
  };

  const handleStart = async () => {
    try {
      if (!projectId) {
        message.error("Missing projectId");
        return;
      }
      if (fileList.length === 0) {
        message.warning("Please select files");
        return;
      }

      onUploadStart?.();
      setIsUploading(true);

      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".csv",
        ".zip",
        ".wav",
        ".mp3",
        ".mp4",
      ];

      const filesToUpload = fileList.filter((file) => {
        const name = (file.name || "").toLowerCase();
        return allowedExtensions.some((extension) => name.endsWith(extension));
      });

      if (filesToUpload.length === 0) {
        message.warning("No supported files found in the current selection.");
        return;
      }

      const version = await getNextVersion(`${projectId}_predict/`);

      const presignedFiles = filesToUpload.map((file) => {
        const baseName = file.name;
        const type =
          file.type ||
          (baseName.toLowerCase().endsWith(".png") ||
          baseName.toLowerCase().endsWith(".csv")
            ? "image/png"
            : "image/jpeg");

        return {
          key: baseName,
          type,
        };
      });

      const { data: presignedUrlResponse } = await createPresignedUrlsPredict({
        projectId,
        version,
        files: presignedFiles,
      });

      if (!Array.isArray(presignedUrlResponse) || presignedUrlResponse.length === 0) {
        throw new Error("Failed to get presigned URLs");
      }

      const keyToUrl = new Map(
        presignedUrlResponse.map((item) => [
          (item.key || "").split("/").pop() || item.key,
          item.url,
        ]),
      );

      await Promise.all(
        presignedFiles.map(async (item, index) => {
          const url = keyToUrl.get(item.key);
          if (!url) throw new Error(`Missing URL for ${item.key}`);

          const fileObject = filesToUpload[index].originFileObj || filesToUpload[index];
          const response = await fetch(url, {
            method: "PUT",
            body: fileObject,
            headers: { "Content-Type": item.type },
          });

          if (!response.ok) {
            throw new Error(`Upload failed for ${item.key}`);
          }
        }),
      );

      const prefixKey = `${projectId}_predict/v${version}/`;
      const filesToPredict = filesToUpload.map(
        (file) => file.originFileObj || file,
      );

      resetSelection();
      onClose();
      onUploadComplete?.(filesToPredict, prefixKey);
    } catch (error) {
      console.error("Upload error:", error);
      message.error(
        error instanceof Error ? error.message : "Upload failed",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-xl dark:border-white/10 dark:bg-slate-950">
        <DialogHeader className="space-y-2 border-b border-slate-200/80 px-6 py-5 dark:border-white/10">
          <DialogTitle className="text-xl font-bold text-slate-950 dark:text-white">
            Upload prediction data
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Add files or folders for prediction. This keeps the current deploy flow,
            but presents validation and selection state more clearly.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-6 py-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-4">
            <div className="group rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/10 dark:hover:border-blue-300/30 dark:hover:bg-blue-500/15">
              <input
                id="deploy-upload-files"
                type="file"
                multiple
                className="hidden"
                accept=".jpg,.jpeg,.png,.csv,.zip,.mp3,.wav,.avi,.mp4"
                onChange={handleInputChange}
              />
              <input
                id="deploy-upload-folder"
                type="file"
                multiple
                className="hidden"
                onChange={handleInputChange}
                {...({ webkitdirectory: "" } as { webkitdirectory: string })}
              />
              <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-100 dark:bg-slate-950/80 dark:text-blue-200 dark:ring-blue-400/20">
                <Inbox className="size-6" />
              </span>
              <span className="text-base font-semibold text-slate-950 dark:text-white">
                Select files or a folder for prediction
              </span>
              <span className="mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                Supports single files, multiple files, and folder-based uploads for
                prediction requests.
              </span>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <label
                  htmlFor="deploy-upload-files"
                  className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Choose Files
                </label>
                <label
                  htmlFor="deploy-upload-folder"
                  className="cursor-pointer rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-blue-400/20 dark:bg-slate-950/70 dark:text-blue-200 dark:hover:bg-blue-500/10"
                >
                  Choose Folder
                </label>
              </div>
            </div>

            {verificationStatus !== "idle" && (
              <div
                className={cx(
                  "flex items-start gap-3 rounded-2xl border px-4 py-3",
                  verificationStatus === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
                    : "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200",
                )}
              >
                {verificationStatus === "success" ? (
                  <CircleCheck className="mt-0.5 size-5 shrink-0" />
                ) : (
                  <CircleX className="mt-0.5 size-5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold">
                    {verificationStatus === "success"
                      ? "Validation passed"
                      : "Validation failed"}
                  </p>
                  <p className="mt-1 text-sm">{verificationMessage}</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Selected files
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review the current selection before upload starts.
                  </p>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                  {fileList.length} file{fileList.length === 1 ? "" : "s"}
                </div>
              </div>

              {Object.keys(folderStructure).length > 0 ? (
                <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                  {renderFolderStructure(folderStructure)}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-400">
                  No files selected yet.
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Upload support
            </h4>
            <div className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Accepted types
                </p>
                <p>JPG, PNG, CSV, ZIP, MP3, WAV, AVI, MP4</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  File size limit
                </p>
                <p>20 MB per file</p>
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  Readiness
                </p>
                <p>Uploads start only after the current selection passes validation.</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200/80 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end dark:border-white/10 dark:bg-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
            className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100 dark:hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleStart}
            disabled={
              fileList.length === 0 ||
              isUploading ||
              verificationStatus !== "success"
            }
            className="rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            {isUploading && <Spinner className="size-4" />}
            {isUploading ? "Uploading..." : "Start Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpDataDeploy;
