import { request } from './index';
import ragMock from '../mock/rag';

export const ragApi = {
  /**
   * 删除消息的RAG查询
   * @param id string 查询ID
   * @returns Promise<any>
   */
  deleteMessageRagQuery: (data: any) =>
    ragMock['/rag/deleteMessageRagQuery']?.(data) || request('/rag/deleteMessageRagQuery', data),
  /**
   * 聊天语义检索
   * @param params any 检索参数
   * @returns Promise<{chunks: any[], queryId: string}> 检索结果
   */
  semanticSearchForChat: (data: any) =>
    ragMock['/rag/semanticSearchForChat']?.(data) || request('/rag/semanticSearchForChat', data),
}; 