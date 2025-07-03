import { FileAccessResponse, FileItem } from '@/services/files';

export interface FileCoreState {
  // 是否正在上传
  uploading: boolean;
  // 文件列表
  fileList: FileItem[];
  // 文件访问 URL 映射
  fileAccessUrlMap: Map<string, FileAccessResponse>;
}

export const initialFileCoreState: FileCoreState = {
  uploading: false,
  fileList: [],
  fileAccessUrlMap: new Map(),
};
