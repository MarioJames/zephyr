export default {
  '/chat/createAssistantMessage': () => ({ id: 'msg-001', content: 'mock assistant message' }),
  '/chat/createAssistantMessageStream': () => ({ id: 'msg-002', content: 'mock stream message' }),
  '/chat/getChatCompletion': () => ({ result: 'mock chat completion' }),
  '/chat/runPluginApi': () => ({ result: 'mock plugin api result' }),
  '/chat/fetchPresetTaskResult': () => ({ result: 'mock preset task result' }),
}; 