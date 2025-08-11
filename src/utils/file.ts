import { FileItem } from '@/services/files';

export interface FileForAI extends Partial<FileItem> {
  content?: string; // 文档内容
}

/**
 * 下载文件
 * @param fileUrl 文件URL
 * @param fileName 文件名
 */
export async function downloadFile(fileUrl: string, fileName: string) {
  try {
    // 使用 fetch 请求获取文件数据流
    const response = await fetch(fileUrl, {
      method: 'GET',
    });

    // 检查请求是否成功
    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`);
    }

    // 将数据流转换为 Blob 对象
    const blob = await response.blob();

    // 创建临时下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // 设置下载文件名
    document.body.append(link);
    link.click();

    // 清理资源
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载过程中发生错误:', error);
  }
}

/**
 * 支持的文档文件类型
 */
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
  'text/csv',
];

/**
 * 支持的图片文件类型
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
];

/**
 * 检查文件类型是否支持
 */
export function isSupportedFileType(file: File): boolean {
  return (
    SUPPORTED_DOCUMENT_TYPES.includes(file.type) ||
    SUPPORTED_IMAGE_TYPES.includes(file.type)
  );
}

/**
 * 检查是否为文档文件
 */
export function isDocumentFile(file: File): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
}

/**
 * 检查是否为图片文件
 */
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}
