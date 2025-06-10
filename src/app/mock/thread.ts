export default {
  '/thread/getThreads': (data) => [
    { id: 'thread-001', topicId: 'topic-001', title: 'mock thread', createdAt: Date.now(), updatedAt: Date.now(), messages: ['msg-1', 'msg-2'] },
    { id: 'thread-002', topicId: 'topic-002', title: 'mock thread 2', createdAt: Date.now(), updatedAt: Date.now(), messages: [] },
  ],
  '/thread/createThreadWithMessage': (data) => ({ threadId: 'thread-002', messageId: data?.messageId || 'msg-001', createdAt: Date.now() }),
  '/thread/updateThread': (data) => ({ ...data, updatedAt: Date.now(), success: true }),
  '/thread/removeThread': (data) => ({ id: data?.id, success: true }),
}; 