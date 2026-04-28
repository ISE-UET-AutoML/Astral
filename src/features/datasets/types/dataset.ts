export type Dataset = {
  id: string;
  title?: string;
  dataType?: string;
  processingStatus?: string;
  createdAt?: string;
  thumbnail?: string;
  quantity?: number;
  metaData?: {
    totalFiles?: number;
    totalSizeKb?: number;
  };
  lsProject?: {
    labelStudioId?: string | number;
    annotatedNums?: number;
    annotationNums?: number;
  };
  [key: string]: unknown;
};
