export default {
  '/trace/traceEvent': (data) => ({ success: true, event: data?.event || 'mock-event', timestamp: Date.now() }),
}; 