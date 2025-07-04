import { ParsedFileContent } from '@/store/file/slices/core/initialState';
import { ChatFileItem } from './action';

export interface UploadState {
  chatUploadFileList: Partial<ChatFileItem>[];
  // 简化状态：只需要跟踪正在上传的文件列表
  uploadingFiles: File[];
  // 总体上传状态
  isUploading: boolean;
  // 解析后的文件内容映射
  parsedFileContentMap: Map<string, ParsedFileContent>;
}

export const initialUploadState: UploadState = {
  chatUploadFileList: [],
  uploadingFiles: [],
  isUploading: false,
  parsedFileContentMap: new Map(),
};
