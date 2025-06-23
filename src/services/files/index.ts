import { http } from '../request';

// 文件相关类型定义
export interface FileMetadata {
  width?: number;
  height?: number;
  duration?: number;
  [key: string]: any;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  hash: string;
  url: string;
  uploadedAt: string;
  metadata: FileMetadata;
}

export interface FileUploadRequest {
  file: File;
  knowledgeBaseId?: string;
  skipCheckFileType?: boolean;
  directory?: string;
}

export interface BatchUploadRequest {
  files: File[];
  knowledgeBaseId?: string;
  skipCheckFileType?: boolean;
  directory?: string;
}

export interface BatchUploadResponse {
  successful: FileUploadResponse[];
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
  knowledgeBaseId?: string;
  search?: string;
}

export interface FileListResponse {
  files: FileUploadResponse[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * 单文件上传
 * @description 上传单个文件到服务器
 * @param data FileUploadRequest
 * @returns FileUploadResponse
 */
function upload(data: FileUploadRequest) {
  const formData = new FormData();
  formData.append('file', data.file);
  if (data.knowledgeBaseId) formData.append('knowledgeBaseId', data.knowledgeBaseId);
  if (data.skipCheckFileType !== undefined) formData.append('skipCheckFileType', String(data.skipCheckFileType));
  if (data.directory) formData.append('directory', data.directory);

  return http.post<FileUploadResponse>('/api/v1/files/upload', formData, {
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
  const formData = new FormData();
  data.files.forEach(file => {
    formData.append('files', file);
  });
  if (data.knowledgeBaseId) formData.append('knowledgeBaseId', data.knowledgeBaseId);
  if (data.skipCheckFileType !== undefined) formData.append('skipCheckFileType', String(data.skipCheckFileType));
  if (data.directory) formData.append('directory', data.directory);

  return http.post<BatchUploadResponse>('/api/v1/files/batch-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
  return http.get<FileUploadResponse>(`/api/v1/files/${id}`);
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

export default {
  upload,
  batchUpload,
  getFileList,
  getFileDetail,
  deleteFile,
};