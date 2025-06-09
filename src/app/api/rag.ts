import { request } from './index';

export const ragApi = {
  /**
   * 删除消息的RAG查询
   * @param id string 查询ID
   * @returns Promise<any>
   */
  deleteMessageRagQuery: (id: string) => request('/rag/deleteMessageRagQuery', { id }),
  /**
   * 聊天语义检索
   * @param params any 检索参数
   * @returns Promise<{chunks: any[], queryId: string}> 检索结果
   */
  semanticSearchForChat: (params: any) => request('/rag/semanticSearchForChat', params),
}; 