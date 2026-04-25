import { TASK_TYPES } from 'src/constants/types'
import Papa from 'papaparse';

type DatasetType = 'IMAGE' | 'TEXT' | 'TABULAR' | 'MULTIMODAL';
type UploadFileLike = File & {
    webkitRelativePath?: string;
    path?: string;
    fileObject?: File;
    boundingBox?: unknown;
};
type OrganizedFile = {
    path: string;
    label: string | null;
    fileObject?: File;
    boundingBox?: unknown;
};
type Chunk = {
    name: string;
    files: OrganizedFile[];
    label: string | null;
};
type CsvMetaData = {
    rowCount: number;
    columnCount: number;
    columns: Record<string, { unique_class_count: number }>;
};

const isAllowedExtension = (fileName: string, allowedExtensions: string[]) => {
    const idx = fileName.lastIndexOf('.')
    if (idx <= 0) {
        return false
    }
    const ext = fileName.substring(idx + 1, fileName.length).toLowerCase()
    return allowedExtensions.includes(ext)
}

const validateFiles = (files: UploadFileLike[], datasetType: DatasetType) => {
    // Chỉ dựa vào phần đuôi file thay vì MIME type vì trình duyệt đôi khi đặt CSV là
    // 'application/vnd.ms-excel' hoặc để trống.
    const allowedExtensionsByType: Record<DatasetType, string[]> = {
        IMAGE: ['jpg', 'jpeg', 'png', 'webp'],
        TEXT: ['csv'],
        TABULAR: ['csv'],
        MULTIMODAL: ['jpg', 'jpeg', 'png', 'webp', 'csv'],
    };

    const allowedExts = allowedExtensionsByType[datasetType] || [];
    return files.filter((file) => {
        const filePath = file.webkitRelativePath || file.name || '';
        return isAllowedExtension(filePath, allowedExts);
    });
};

const validateFilesForPrediction = (files: UploadFileLike[], projectType: keyof typeof TASK_TYPES) => {
    const projectInfo = TASK_TYPES[projectType]
    if (!projectInfo) {
        alert('Unsupported project type.')
        return []
    }

    const { allowedExtensions } = projectInfo
    const validFiles: UploadFileLike[] = []
    const invalidFiles: string[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Don't need to validate dot files (hidden files), just skip them
        if (file.name.startsWith('.')) {
            continue
        }

        // For files in folders, use webkitRelativePath if available
        const filePath = file.webkitRelativePath || file.name

        // Skip folders themselves
        if (file.size === 0 && file.type === "") {
            continue
        }

        if (isAllowedExtension(filePath, allowedExtensions)) {
            validFiles.push(file)
        } else {
            invalidFiles.push(filePath)
        }
    }

    if (invalidFiles.length > 0) {
        alert(
            `We only accept ${allowedExtensions.join(', ').toUpperCase()} format, please remove these files:\n${invalidFiles.join('\n')}`
        )
        return []
    }

    return validFiles
}

const organizeFiles = (files: Array<Required<Pick<UploadFileLike, 'path'>> & UploadFileLike>) => {
    const fileMap = new Map<string, OrganizedFile[]>();

    files.forEach((file) => {
        const pathParts = file.path.split('/');

        if (pathParts.length >= 3) {
            // Ex: path = 'train/dog/dog_10.jpg' → label = 'dog'
            const label = pathParts[pathParts.length - 2];

            if (!fileMap.has(label)) {
                fileMap.set(label, []);
            }
            fileMap.get(label).push({
                path: file.path,
                label,
                fileObject: file.fileObject,
                boundingBox: file.boundingBox,
            });
        } else {
            // Ex: path = 'train/dog_10.jpg' OR 'dog_10.jpg' → unlabeled
            if (!fileMap.has('unlabeled')) {
                fileMap.set('unlabeled', []);
            }
            fileMap.get('unlabeled').push({
                path: file.path,
                label: null,
                fileObject: file.fileObject,
                boundingBox: file.boundingBox,
            });
        }
    });
    return fileMap;
};


const createChunks = (fileMap: Map<string, OrganizedFile[]>, chunkSize: number) => {
    const chunks: Chunk[] = [];

    Array.from(fileMap.entries()).forEach(([label, files]) => {
        for (let i = 0; i < files.length; i += chunkSize) {
            const chunkFiles = files.slice(i, i + chunkSize);
            const chunkIndex = Math.floor(i / chunkSize);

            // Updated naming logic for unlabeled data
            const chunkName = label === 'unlabeled'
                ? `chunk_unlabel_${chunkIndex}.zip`
                : `chunk_${label}_${chunkIndex}.zip`;

            chunks.push({
                name: chunkName,
                files: chunkFiles,
                label: label === 'unlabeled' ? null : label,
            });
        }
    });

    return chunks;
};

const extractCSVMetaData = async (file: File) => {
    return new Promise<CsvMetaData>((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                const rows = results.data as Array<Record<string, string>>;
                if (rows.length === 0) return resolve({ rowCount: 0, columnCount: 0, columns: {} });

                const columns: CsvMetaData['columns'] = {};
                Object.keys(rows[0]).forEach((col) => {
                    const uniqueValues = new Set();
                    rows.forEach((row) => {
                        if (row[col] !== '') uniqueValues.add(row[col]);
                    });
                    columns[col] = {
                        unique_class_count: uniqueValues.size,
                    };
                });

                resolve({
                    rowCount: rows.length,
                    columnCount: Object.keys(rows[0]).length,
                    columns,
                });
            },
            error: function (error) {
                reject(error);
            },
        });
    });
};

export { validateFiles, organizeFiles, createChunks, extractCSVMetaData, validateFilesForPrediction }
