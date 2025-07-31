import { http } from '../request';

// 文件相关类型定义
export interface FileMetadata {
  date: string;
  dirname: string;
  filename: string;
  path: string;
}

export interface FileItem {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  hash: string;
  url: string;
  uploadedAt: string;
  metadata: FileMetadata;
  createdAt: string;
  updatedAt: string;
  base64?: string;
}

export interface FilePublicUploadResponse extends FileItem {
  url: string;
}

export interface FileUploadRequest {
  file: File;
  skipCheckFileType?: boolean;
  directory?: string;
  sessionId?: string;
  [key: string]: unknown;
}

export interface BatchUploadRequest {
  files: File[];
  sessionId?: string;
  skipCheckFileType?: boolean;
  directory?: string;
  [key: string]: unknown;
}

export interface BatchUploadResponse {
  successful: FileItem[];
  failed: Array<{
    filename: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface FileListRequest {
  page?: number;
  pageSize?: number;
  fileType?: string;
  search?: string | null;
  [key: string]: unknown;
}

export interface FileListResponse {
  files: FileItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FileAccessResponse {
  /** URL过期时间戳 */
  expiresAt: string;
  /** URL过期时间（秒） */
  expiresIn: number;
  /** 文件ID */
  fileId: string;
  /** 文件名 */
  filename: string;
  /** 预签名访问URL */
  url: string;
}

export interface DocumentParseRequest {
  file: File;
  [key: string]: unknown;
}

export interface UploadAndParseRequest {
  file: File;
  skipCheckFileType?: boolean;
  directory?: string;
  [key: string]: unknown;
}

/**
 * 文件解析响应类型
 */
export interface FileParseResponse {
  /** 解析后的文本内容 */
  content: string;
  /** 解析错误信息 */
  error?: string;
  /** 文件ID */
  fileId: string;
  /** 文件类型 */
  fileType: string;
  /** 文件名 */
  filename: string;
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
  /** 解析状态 */
  parseStatus: 'completed' | 'failed';
  /** 解析时间 */
  parsedAt: string;
}

export interface UploadAndParseResponse {
  /** 上传的文件对象 */
  fileItem: FileItem;
  /** 解析结果 */
  parseResult: FileParseResponse;
}

export interface BatchGetFileAndParseContentResponse {
  files: UploadAndParseResponse[];
  failed: Array<{
    fileId: string;
    error: string;
  }>;
  success: number;
  total: number;
}

/**
 * 单文件上传
 * @description 上传单个文件到服务器
 * @param data FileUploadRequest
 * @returns FileUploadResponse
 */
function upload(data: FileUploadRequest) {
  const formData = new FormData() as any;

  formData.append('file', data.file);

  if (data.sessionId) formData.append('sessionId', data.sessionId);
  if (data.skipCheckFileType !== undefined)
    formData.append('skipCheckFileType', String(data.skipCheckFileType));
  if (data.directory) formData.append('directory', data.directory);

  return http.post<FileItem>('/api/v1/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 批量文件上传
 * @description 批量上传多个文件到服务器
 * @param data BatchUploadRequest
 * @returns BatchUploadResponse
 */
function batchUpload(data: BatchUploadRequest) {
  const formData = new FormData() as any;
  data.files.forEach((file) => {
    formData.append('files', file);
  });
  if (data.sessionId) formData.append('sessionId', data.sessionId);
  if (data.skipCheckFileType !== undefined)
    formData.append('skipCheckFileType', String(data.skipCheckFileType));
  if (data.directory) formData.append('directory', data.directory);

  return http.post<BatchUploadResponse>(
    '/api/v1/files/batch-upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

/**
 * 单文件上传（公共读）
 * @description 上传单个文件到服务器
 * @param data FileUploadRequest
 * @returns FileUploadResponse
 */
function uploadPublic(data: FileUploadRequest) {
  const formData = new FormData() as any;
  formData.append('file', data.file);
  if (data.skipCheckFileType !== undefined)
    formData.append('skipCheckFileType', String(data.skipCheckFileType));
  if (data.directory) formData.append('directory', data.directory);

  return http.post<FilePublicUploadResponse>(
    '/api/v1/files/upload-public',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

/**
 * 获取文件列表
 * @description 获取文件列表，支持分页和过滤
 * @param params FileListRequest
 * @returns FileListResponse
 */
function getFileList(params?: FileListRequest) {
  return http.get<FileListResponse>('/api/v1/files', params);
}

/**
 * 获取文件详情
 * @description 根据文件ID获取文件详细信息
 * @param id string
 * @returns FileUploadResponse
 */
function getFileDetail(id: string) {
  return http.get<FileItem>(`/api/v1/files/${id}`);
}

/**
 * 批量获取文件详情和解析内容
 */
function batchGetFileAndParseContent(fileIds: string[]) {
  return http.post<BatchGetFileAndParseContentResponse>(
    `/api/v1/files/batch-get-parsed-files`,
    {
      fileIds,
    }
  );
}

/**
 * 获取文件访问URL
 */
function getFileAccessUrl(id: string, params?: { expiresIn?: number }) {
  return http.get<FileAccessResponse>(`/api/v1/files/${id}/url`, params);
}

/**
 * 删除文件
 * @description 根据文件ID删除文件
 * @param id string
 * @returns void
 */
function deleteFile(id: string) {
  return http.delete<void>(`/api/v1/files/${id}`);
}

/**
 * 解析文档内容 - 使用现有文件ID
 * @description 解析已上传文件的内容，支持 PDF、Word、Excel、文本等格式
 * @param fileId string 文件ID
 * @param params { skipCheckFileType?: boolean } 可选参数
 * @returns FileParseResponse
 */
function parseDocumentById(
  fileId: string,
  params?: { skipCheckFileType?: boolean }
) {
  return http.post<FileParseResponse>(`/api/v1/files/${fileId}/parse`, params);
}

/**
 * 上传并解析文档 - 一体化接口
 * @description 一次性完成文件上传和解析，返回文件对象和解析结果
 * @param data UploadAndParseRequest
 * @returns UploadAndParseResponse
 */
function uploadAndParseDocument(data: UploadAndParseRequest) {
  const formData = new FormData() as any;
  formData.append('file', data.file);

  if (data.skipCheckFileType !== undefined)
    formData.append('skipCheckFileType', String(data.skipCheckFileType));
  if (data.directory) formData.append('directory', data.directory);

  return http.post<UploadAndParseResponse>(
    '/api/v1/files/upload-and-parse',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
}

export default {
  upload,
  uploadPublic,
  batchUpload,
  getFileList,
  getFileDetail,
  deleteFile,
  getFileAccessUrl,
  parseDocumentById,
  uploadAndParseDocument,
  batchGetFileAndParseContent,
};
