import { zephyrEnv } from '@/env/zephyr';
import { http } from '../request';

export type StructuredData = {
  label: string;
  value: string | string[];
};

// 结构化数据项类型
export interface StructuredDataItem {
  id: number;
  fileId: string;
  data: StructuredData[]; // JSONB 数据
}

// 结构化数据创建请求类型
export interface StructuredDataCreateRequest {
  fileId: string;
}

/**
 * 调用 NLP 服务把文件内容处理成结构化的数据
 */
async function extractFileStructuredData(
  text: string
): Promise<StructuredData[]> {
  try {
    const response = await fetch(
      `${zephyrEnv.NEXT_PUBLIC_NLP_ENDPOINT}/api/extract`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }
    );

    const structuredData = await response.json();

    return structuredData;
  } catch (error) {
    console.error('extractFileStructuredData error:', error);
    throw error;
  }
}

/**
 * 根据文件ID获取结构化数据
 * @description 通过 fileId 获取文件的结构化数据
 * @param fileId string
 * @returns StructuredDataItem | null
 */
async function getStructuredDataByFileId(
  fileId: string
): Promise<StructuredDataItem | null> {
  try {
    return http.get<StructuredDataItem>('/api/structured-data', {
      fileId,
    });
  } catch (error) {
    console.log('getStructuredDataByFileId error:', error);
    throw error;
  }
}

/**
 * 创建结构化数据
 * @description 为指定文件创建结构化数据，自动获取文档内容并调用 NLP 解析
 * @param fileId string
 * @returns StructuredDataItem
 */
async function createStructuredData(
  fileId: string
): Promise<StructuredDataItem> {
  try {
    return http.post<StructuredDataItem>('/api/structured-data', { fileId });
  } catch (error) {
    console.error('createStructuredData error:', error);
    throw error;
  }
}

/**
 * 更新结构化数据
 * @description 根据 fileId 更新结构化数据，重新获取文档内容并调用 NLP 解析
 * @param fileId string
 * @returns StructuredDataItem
 */
async function updateStructuredDataByFileId(
  fileId: string
): Promise<StructuredDataItem> {
  try {
    return http.put<StructuredDataItem>(
      `/api/structured-data?fileId=${fileId}`
    );
  } catch (error) {
    console.error('updateStructuredDataByFileId error:', error);
    throw error;
  }
}

/**
 * 删除结构化数据
 * @description 根据 fileId 删除结构化数据
 * @param fileId string
 * @returns void
 */
async function deleteStructuredDataByFileId(fileId: string): Promise<void> {
  try {
    return http.delete<void>(`/api/structured-data?fileId=${fileId}`);
  } catch (error) {
    console.error('deleteStructuredDataByFileId error:', error);
    throw error;
  }
}

/**
 * 创建或更新结构化数据
 * @description 如果文件已有结构化数据则更新，否则创建新的
 * @param fileId string
 * @returns StructuredDataItem
 */
async function upsertStructuredData(
  fileId: string
): Promise<StructuredDataItem> {
  try {
    // 先检查是否存在
    const existing = await getStructuredDataByFileId(fileId);

    if (existing) {
      // 如果存在，更新数据
      return updateStructuredDataByFileId(fileId);
    } else {
      // 如果不存在，创建新记录
      return createStructuredData(fileId);
    }
  } catch (error) {
    console.error('upsertStructuredData error:', error);
    throw error;
  }
}

/**
 * 检查文件是否存在结构化数据
 * @description 检查指定文件是否已有结构化数据
 * @param fileId string
 * @returns boolean
 */
async function hasStructuredData(fileId: string): Promise<boolean> {
  try {
    const data = await getStructuredDataByFileId(fileId);
    return data !== null;
  } catch (error) {
    console.error('hasStructuredData error:', error);
    return false;
  }
}

// 结构化数据管理 API
const structuredDataAPI = {
  extractFileStructuredData,
  getStructuredDataByFileId,
  createStructuredData,
  updateStructuredDataByFileId,
  deleteStructuredDataByFileId,
  upsertStructuredData,
  hasStructuredData,
};

export default structuredDataAPI;
