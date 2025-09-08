import { http } from '../request';

// 新结构：摘要与实体
export interface SummaryEntity {
  label: string;
  value: string;
}

export interface FileSummaryData {
  summary: string;
  entities: SummaryEntity[];
}

// 结构化数据项类型
export interface StructuredDataItem {
  id: number;
  fileId: string;
  data: FileSummaryData; // JSONB 数据
}

// 结构化数据创建请求类型
export interface StructuredDataCreateRequest {
  fileId: string;
  data: FileSummaryData;
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
 * 创建或更新结构化数据
 * @description 如果文件已有结构化数据则更新，否则创建新的
 * @param fileId string
 * @returns StructuredDataItem
 */
async function upsertStructuredData(
  request: StructuredDataCreateRequest
): Promise<StructuredDataItem> {
  try {
    return http.post<StructuredDataItem>(
      '/api/structured-data',
      request as Record<string, any>
    );
  } catch (error) {
    console.error('createStructuredData error:', error);
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
  hasStructuredData,
  upsertStructuredData,
  getStructuredDataByFileId,
  deleteStructuredDataByFileId,
};

export default structuredDataAPI;
