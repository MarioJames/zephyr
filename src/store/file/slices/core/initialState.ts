import { FileAccessResponse, FileItem, FileParseResponse } from '@/services/files';

export interface ParsedFileContent {
  /** 文件ID */
  fileId: string;
  /** 解析后的文本内容 */
  content: string;
  /** 文件名 */
  filename: string;
  /** 文件类型 */
  fileType: string;
  /** 解析状态 */
  parseStatus: 'completed' | 'failed';
  /** 解析时间 */
  parsedAt: string;
  /** 解析错误信息 */
  error?: string;
  /** 文档元数据 */
  metadata?: {
    /** 页数 */
    pages?: number;
    /** 文档标题 */
    title?: string;
    /** 字符总数 */
    totalCharCount?: number;
    /** 行总数 */
    totalLineCount?: number;
  };
}

export interface FileCoreState {
  // 是否正在上传
  uploading: boolean;
  // 是否正在解析
  parsing: boolean;
  // 文件列表
  fileList: FileItem[];
  // 文件访问 URL 映射
  fileAccessUrlMap: Map<string, FileAccessResponse>;
  // 解析后的文件内容映射
  parsedFileContentMap: Map<string, ParsedFileContent>;
}

export const initialFileCoreState: FileCoreState = {
  uploading: false,
  parsing: false,
  fileList: [],
  fileAccessUrlMap: new Map(),
  parsedFileContentMap: new Map(),
};
