export default {
  '/sync/enabledSync': (data) => ({ enabled: true, userId: data?.userId || 'mock-user' }),
  '/sync/disableSync': (data) => ({ enabled: false, userId: data?.userId || 'mock-user' }),
}; 