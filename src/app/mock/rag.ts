export default {
  '/rag/deleteMessageRagQuery': (data) => ({ success: true, messageId: data?.id || 'mock-msg-id' }),
  '/rag/semanticSearchForChat': (data) => ({
    chunks: [
      { id: 'chunk-1', content: 'Mock chunk 1', similarity: 0.98 },
      { id: 'chunk-2', content: 'Mock chunk 2', similarity: 0.95 },
    ],
    queryId: data?.query || 'mock-query-id',
  }),
}; 