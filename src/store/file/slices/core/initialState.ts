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

export interface DockFileItem extends FileItem {
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface FileCoreState {
  // 是否正在上传
  uploading: boolean;
  // 文件列表
  fileList: FileItem[];
  // 文件访问 URL 映射
  fileAccessUrlMap: Map<string, FileAccessResponse>;
  // 解析后的文件内容映射
  parsedFileContentMap: Map<string, ParsedFileContent>;
  // Dock 文件列表
  dockFileList: DockFileItem[];
  // 选中的文件 ID 列表
  selectedFileIds: string[];
  // 文件列表加载状态
  loading: boolean;
  // 文件列表分页信息
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  // 文件列表排序信息
  sorter: {
    field: string;
    order: 'ascend' | 'descend';
  };
  // 文件列表搜索关键词
  searchKeyword: string;
}

export const initialFileCoreState: FileCoreState = {
  uploading: false,
  fileList: [],
  fileAccessUrlMap: new Map(),
  parsedFileContentMap: new Map(),
  dockFileList: [],
  selectedFileIds: [],
  loading: false,
  pagination: {
    current: 1,
    pageSize: 20,
    total: 0,
  },
  sorter: {
    field: 'uploadedAt',
    order: 'descend',
  },
  searchKeyword: '',
};
