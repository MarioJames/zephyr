export default {
  '/thread/getThreads': () => [{ id: 'thread-001', topicId: 'topic-001', title: 'mock thread' }],
  '/thread/createThreadWithMessage': () => ({ threadId: 'thread-002', messageId: 'msg-001' }),
  '/thread/updateThread': () => ({ success: true }),
  '/thread/removeThread': () => ({ success: true }),
}; 