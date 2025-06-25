import { FileItem } from "@/services/files";

export interface UploadState {
  chatUploadFileList: FileItem[];
  // 简化状态：只需要跟踪正在上传的文件ID列表
  uploadingIds: string[];
  // 总体上传状态
  isUploading: boolean;
}

export const initialUploadState: UploadState = {
  chatUploadFileList: [],
  uploadingIds: [],
  isUploading: false,
};
