import { Button as UiButton } from "src/components/ui/button";
import {
  Alert as UiAlert,
  AlertDescription as UiAlertDescription,
  AlertTitle as UiAlertTitle,
} from "src/components/ui/alert";
import { Spinner as UiSpinner } from "src/components/ui/spinner";
import { toast } from "sonner";
import {
  Inbox as InboxOutlined,
  X as CloseOutlined,
  Folder as FolderOutlined,
  File as FileOutlined,
  Trash2 as DeleteOutlined,
  CircleCheck as CheckCircleOutlined,
  CircleX as CloseCircleOutlined,
} from "lucide-react";
import { useState } from "react";
import { createPresignedUrlsPredict } from "src/features/datasets/api/dataset";
import { createDownPresignedUrlsForFolder } from "src/features/datasets/api/dataset";
import { getVersionCount } from "src/features/datasets/api/dataset";
import Papa from "papaparse";
const cx = (...classes) => classes.filter(Boolean).join(" ");
const getToastContent = (value) =>
  typeof value === "object" && value?.content ? value.content : value;
const message = {
  success: (value) => toast.success(getToastContent(value)),
  error: (value) => toast.error(getToastContent(value)),
  warning: (value) => toast.warning(getToastContent(value)),
  info: (value) => toast.info(getToastContent(value)),
  loading: (value) => toast.loading(getToastContent(value)),
};
const Button = ({
  children,
  icon,
  loading,
  disabled,
  htmlType,
  type,
  className = "",
  ...props
}) => (
  <UiButton
    type={htmlType || "button"}
    disabled={disabled || loading}
    className={className}
    {...props}
  >
    {loading && <UiSpinner className="mr-2" />}
    {icon && <span className="inline-flex">{icon}</span>}
    {children}
  </UiButton>
);
const Alert = ({
  message,
  description,
  type,
  showIcon,
  className = "",
  ...props
}) => (
  <UiAlert
    variant={type === "error" ? "destructive" : "default"}
    className={className}
    {...props}
  >
    {message && <UiAlertTitle>{message}</UiAlertTitle>}
    {description && <UiAlertDescription>{description}</UiAlertDescription>}
  </UiAlert>
);
const Modal = ({
  open,
  visible,
  onCancel,
  onClose,
  title,
  footer,
  children,
  width,
  className = "",
  centered,
  ...props
}) => {
  const isOpen = open ?? visible;
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel || onClose}
    >
      <div
        className={cx(
          "max-h-[90vh] overflow-auto rounded-xl border bg-background p-4 shadow-xl",
          className,
        )}
        style={{
          width: typeof width === "number" ? width : width || undefined,
          ...props.style,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <div className="mb-4 text-lg font-semibold">{title}</div>}
        {children}
        {footer !== null && footer !== undefined && (
          <div className="mt-4 flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
};
const Upload = ({
  children,
  beforeUpload,
  onChange,
  multiple,
  directory,
  className = "",
  ...props
}) => {
  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const fileList = files.filter((file) =>
      beforeUpload ? beforeUpload(file) !== false : true,
    );
    onChange?.({ fileList });
  };
  return (
    <label
      className={cx(
        "block cursor-pointer rounded-lg border border-dashed p-4 text-center",
        className,
      )}
    >
      <input
        type="file"
        multiple={multiple ?? true}
        webkitdirectory={directory ? "" : undefined}
        className="hidden"
        onChange={handleFiles}
      />
      {children}
    </label>
  );
};
Upload.Dragger = Upload;

const { Dragger } = Upload;

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
  const [verificationStatus, setVerificationStatus] = useState("idle"); // 'idle', 'success', 'error'
  const [verificationMessage, setVerificationMessage] = useState("");
  const verifyData = async (
    files: UploadListFile[],
    taskType?: string,
    featureColumns: string[] = [],
  ): Promise<VerificationResult> => {
    // Temporary bypass: allow all uploaded data types through verification.
    return {
      isValid: true,
      message: "Data verification is temporarily disabled.",
    };

    if (taskType === "IMAGE_CLASSIFICATION") {
      const allImages = files.every((f) => /\.(jpg|jpeg|png)$/i.test(f.name));
      if (!allImages) {
        return {
          isValid: false,
          message: "For Image classification, only JPG/PNG files are allowed.",
        };
      }
      return { isValid: true, message: "Image files are valid." };
    }

    if (taskType === "AUDIO_CLASSIFICATION") {
      const allAudios = files.every((f) => /\.(mp3|wav|ogg)$/i.test(f.name));
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
              message: "CSV parse error: " + errors[0].message,
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
            cols.length !== featureColumns.length ||
            !featureColumns.every((c) => cols.includes(c))
          ) {
            resolve({
              isValid: false,
              message:
                "CSV columns must exactly match feature columns: " +
                featureColumns.join(", "),
            });
            return;
          }
          resolve({ isValid: true, message: "CSV data is valid." });
        },
        error: (error: { message: string }) => {
          resolve({
            isValid: false,
            message: "Failed to parse CSV file: " + error.message,
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
    } catch (e) {
      console.error("Get next version error:", e);
      return 1;
    }
  };

  const getLatestVersion = async (pid: string) => {
    const next = await getNextVersion(pid);
    return Math.max(1, next - 1);
  };

  const getLatestDownloadUrls = async (pid: string) => {
    const v = await getLatestVersion(pid);
    const { data } = await createDownPresignedUrlsForFolder(pid, v);

    return { version: v, urls: data };
  };

  const getLatestUploadPresigns = async (
    pid: string,
    files: Array<{ key: string; type: string }>,
  ) => {
    const v = await getLatestVersion(pid);
    const { data } = await createPresignedUrlsPredict({
      projectId: pid,
      version: v,
      files,
    });
    return { version: v, presigned: data };
  };

  const handleStart = async () => {
    try {
      if (!projectId) {
        message.error("Missing projectId");
        return;
      }
      if (!fileList || fileList.length === 0) {
        message.warning("Please select files");
        return;
      }

      if (typeof onUploadStart === "function") {
        onUploadStart();
      }
      setIsUploading(true);

      // Không gọi deploy tại đây để ưu tiên upload dữ liệu trước

      // Only allow image files and flatten to base filename
      const allowed = [
        ".jpg",
        ".jpeg",
        ".png",
        ".csv",
        ".zip",
        ".wav",
        ".mp3",
        ".mp4",
      ];
      const imageFiles = fileList.filter((f) => {
        const name = (f.name || "").toLowerCase();
        return allowed.some((ext) => name.endsWith(ext));
      });

      if (imageFiles.length === 0) {
        message.warning("No valid image files (.jpg, .jpeg, .png)");
        return;
      }

      // Tính version động theo deploy_data hiện có
      const version = await getNextVersion(`${projectId}_predict/`);

      // Build presign request for predict endpoint: flatten keys and set version
      const filesToUpload = imageFiles.map((f) => {
        let baseName = f.name;

        const type =
          f.type ||
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
        files: filesToUpload,
      });
      //console.log('Presigned response:', presignedUrlResponse)
      if (
        !Array.isArray(presignedUrlResponse) ||
        presignedUrlResponse.length === 0
      ) {
        throw new Error("Failed to get presigned URLs");
      }

      // Map basename(key) -> url for upload (backend returns full S3 key with prefix)
      const keyToUrl = new Map(
        presignedUrlResponse.map((item) => [
          (item.key || "").split("/").pop() || item.key,
          item.url,
        ]),
      );

      // Upload all files
      await Promise.all(
        filesToUpload.map(async (item, idx) => {
          // item.key is baseName; look up by basename mapping
          //console.log('Uploading item', item, 'index', idx)
          const url = keyToUrl.get(item.key);
          //console.log('Uploading', item.key, 'to', url)
          if (!url) throw new Error(`Missing URL for ${item.key}`);
          const fileObj = imageFiles[idx].originFileObj || imageFiles[idx];
          const resp = await fetch(url, {
            method: "PUT",
            body: fileObj,
            headers: { "Content-Type": item.type },
          });
          if (!resp.ok) throw new Error(`Upload failed for ${item.key}`);
        }),
      );

      // Lưu prefix folder mới nhất lên user_service (deploy_data)
      const prefixKey = `${projectId}_predict/v${version}/`;

      const filesToPredict = imageFiles.map(
        (file) => file.originFileObj || file,
      );

      setFileList([]);
      setFolderStructure({});
      // setVerificationStatus('idle')
      // Đóng modal sau khi upload thành công
      if (typeof onClose === "function") {
        onClose();
      }

      if (typeof onUploadComplete === "function") {
        onUploadComplete(filesToPredict, prefixKey);
      }
    } catch (e) {
      console.error("Upload error:", e);
      const error = e as { message?: string };
      message.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png,.csv, .zip, .mp3, .wav, .avi, .mp4",
    fileList,
    showUploadList: false,
    beforeUpload: (file: UploadListFile) => {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error("File must be smaller than 20MB!");
        return false;
      }
      return false;
    },
    onChange: async (info: { fileList: UploadListFile[] }) => {
      const { fileList: newFileList } = info;
      if (newFileList.length === 0) {
        setFileList([]);
        setFolderStructure({});
        setVerificationStatus("idle");
        return;
      }

      const verificationResult = await verifyData(
        newFileList,
        taskType,
        featureColumns,
      );

      if (verificationResult.isValid) {
        setVerificationStatus("success");
        setVerificationMessage("Data verification successful! Ready to start.");
        setFileList(newFileList);
        setFolderStructure(createFolderStructure(newFileList));
      } else {
        setVerificationStatus("error");
        setVerificationMessage(verificationResult.message);
        setFileList([]); // Xóa file nếu không hợp lệ
        setFolderStructure({});
      }
    },
    onDrop(e: { dataTransfer: { files: FileList } }) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // Hàm tạo cấu trúc thư mục từ danh sách file
  const createFolderStructure = (files: UploadListFile[]) => {
    const structure: FolderStructure = {};

    files.forEach((file) => {
      const rel =
        file.originFileObj?.webkitRelativePath ||
        file.webkitRelativePath ||
        file.name;
      const pathParts = rel.split("/");

      let current: FolderStructure = structure;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
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

  // Hàm render cấu trúc thư mục (kèm path đầy đủ)
  const renderFolderStructure = (
    structure: FolderStructure,
    path: string[] = [],
  ) => {
    const level = path.length;
    return Object.entries(structure).map(([name, item]) => {
      const currentPath = [...path, name];
      return (
        <div
          key={currentPath.join("/")}
          className="ml-4"
          style={{ marginLeft: `${level * 20}px` }}
        >
          {item.type === "folder" ? (
            <div>
              <div className="flex items-center py-1">
                <FolderOutlined className="mr-2 text-amber-400" />
                <span className="font-medium">{name}/</span>
                <button
                  onClick={() => handleRemovePath(currentPath)}
                  className="ml-2 text-red-400 hover:text-red-300"
                  type="button"
                >
                  <DeleteOutlined />
                </button>
              </div>
              {renderFolderStructure(item.children, currentPath)}
            </div>
          ) : (
            <div className="flex items-center py-1">
              <FileOutlined className="mr-2 text-blue-500" />
              <span className="text-sm truncate max-w-xs" title={name}>
                {name} ({(item.file.size / 1024).toFixed(2)} KB)
              </span>
              <button
                onClick={() => handleRemovePath(currentPath)}
                className="ml-2 text-red-400 hover:text-red-300"
                type="button"
              >
                <DeleteOutlined />
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  // Xóa file/folder theo path (pathParts: mảng tên các cấp)
  const handleRemovePath = (pathParts: string[]) => {
    setFolderStructure((prev) => {
      const clone = JSON.parse(JSON.stringify(prev)) as FolderStructure;
      let parent: FolderStructure = clone;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const key = pathParts[i];
        if (!parent[key]) return prev;
        const node = parent[key];
        if (node.type !== "folder") return prev;
        parent = node.children;
      }
      const last = pathParts[pathParts.length - 1];
      if (last != null && parent[last]) {
        delete parent[last];
      }
      return clone;
    });

    // đồng bộ fileList: loại bỏ các file nằm trong folder bị xóa hoặc file vừa xóa
    setFileList((prev) => {
      return prev.filter((f) => {
        const rel =
          f.originFileObj?.webkitRelativePath || f.webkitRelativePath || f.name;
        const relParts = rel.split("/");
        const target = pathParts;
        // giữ lại file nếu không nằm trong nhánh bị xóa
        return !target.every((p, idx) => relParts[idx] === p);
      });
    });
  };

  const handleCancel = () => {
    setFileList([]);
    setFolderStructure({});
    setVerificationStatus("idle");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      closeIcon={<CloseOutlined className="text-[var(--text)]" />}
      styles={{
        content: {
          background: "var(--card-gradient)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        },
        body: {
          background: "var(--card-gradient)",
          color: "var(--text)",
        },
      }}
    >
      <div className="p-4">
        <h3 className="text-xl font-bold mb-4 text-[var(--text)]">
          Upload Data
        </h3>

        <Dragger
          {...uploadProps}
          className="updeploy-dragger border border-dashed border-[var(--border)] rounded-[12px] bg-transparent"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-[var(--accent-text)]" />
          </p>
          <p className="ant-upload-text" style={{ color: "var(--text)" }}>
            Click or drag folder/file to this area to upload
          </p>
          <p
            className="ant-upload-hint"
            style={{ color: "var(--secondary-text)" }}
          >
            Support for single file, multiple files, or entire folder upload.
            JPG, PNG, CSV, JSON, Excel, MP3, WAV, AVI, MP4 files are allowed.
            (MAX. 10MB per file)
          </p>
        </Dragger>

        {verificationStatus !== "idle" && (
          <Alert
            className="mt-4"
            type={verificationStatus}
            showIcon
            message={
              <span className="font-semibold">
                {verificationStatus === "success"
                  ? "Validation Passed"
                  : "Validation Failed"}
              </span>
            }
            description={verificationMessage}
            icon={
              verificationStatus === "success" ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
          />
        )}

        {folderStructure && Object.keys(folderStructure).length > 0 && (
          <div className="mt-4 p-3 rounded-lg [background:var(--card-gradient)] border border-[var(--border)]">
            <p className="text-sm mb-2 text-[var(--text)]">
              Selected structure:
            </p>
            <div className="max-h-40 overflow-y-auto">
              {renderFolderStructure(folderStructure)}
            </div>
          </div>
        )}

        {fileList.length > 0 && (
          <div
            className="mt-2 text-xs"
            style={{ color: "var(--secondary-text)" }}
          >
            Total files: {fileList.length}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={handleCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleStart}
            disabled={
              fileList.length === 0 ||
              isUploading ||
              verificationStatus !== "success"
            }
            loading={isUploading}
          >
            Start
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpDataDeploy;
