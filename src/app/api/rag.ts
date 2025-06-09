import { request } from './index';

export const ragApi = {
  deleteMessageRagQuery: (id: string) => request('/rag/deleteMessageRagQuery', { id }),
  semanticSearchForChat: (params: any) => request('/rag/semanticSearchForChat', params),
}; 