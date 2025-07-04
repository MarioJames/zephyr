export interface FileUploadState {
  progress: number;
  /**
   * rest time in s
   */
  restTime: number;
  /**
   * upload speed in Byte/s
   */
  speed: number;
}

export interface IAsyncTaskError {
  body: string | { detail: string };
  name: string;
}

export enum AsyncTaskStatus {
  Error = "error",
  Pending = "pending",
  Processing = "processing",
  Success = "success",
}

export interface FileParsingTask {
  chunkCount?: number | null;
  chunkingError?: IAsyncTaskError | null;
  chunkingStatus?: AsyncTaskStatus | null;
  embeddingError?: IAsyncTaskError | null;
  embeddingStatus?: AsyncTaskStatus | null;
  finishEmbedding?: boolean;
}

export type FileUploadStatus =
  | "pending"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export enum FilesTabs {
  All = "all",
  Audios = "audios",
  Documents = "documents",
  Images = "images",
  Videos = "videos",
  Websites = "websites",
}

export interface FileListItem {
  createdAt: Date;
  id: string;
  name: string;
  size: number;
  updatedAt: Date;
  url: string;
  fileType: string;
}

export interface UploadFileItem {
  base64Url?: string;
  file: File;
  fileUrl?: string;
  id: string;
  status: FileUploadStatus;
  tasks?: FileParsingTask;
  uploadState?: FileUploadState;
}
