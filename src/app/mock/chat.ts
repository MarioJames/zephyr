export default {
  '/chat/createAssistantMessage': (data) => ({ id: 'msg-001', content: data?.content || 'mock assistant message', role: 'assistant', createdAt: Date.now() }),
  '/chat/createAssistantMessageStream': (data) => ({ id: 'msg-002', content: data?.content || 'mock stream message', role: 'assistant', createdAt: Date.now(), stream: true }),
  '/chat/getChatCompletion': (data) => ({ result: `mock chat completion for ${data?.prompt || ''}`, choices: [{ text: 'This is a mock completion.' }] }),
  '/chat/runPluginApi': (data) => ({ result: `mock plugin api result for ${data?.plugin || ''}` }),
  '/chat/fetchPresetTaskResult': (data) => ({ result: `mock preset task result for ${data?.task || ''}` }),
}; 