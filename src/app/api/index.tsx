// 临时 API 桥接层 - 将旧的 API 调用重定向到新的 services
// 这个文件的目的是保持向后兼容性，避免大量代码修改

export { default as request, http } from './request';
export { messageApi } from './message-bridge';
export { topicApi } from './topic-bridge';
export { chatApi } from './chat-bridge';
export { sessionApi } from './session-bridge';
export { userApi } from './user-bridge';
export { syncApi } from './sync-bridge';
export { agentApi } from './agent-bridge';
export { aiModelApi } from './ai-model-bridge';
export { aiProviderApi } from './ai-provider-bridge';
export { traceApi } from './trace-bridge';
export { searchApi } from './search-bridge';
export { ragApi } from './rag-bridge';
export { fileApi } from './file-bridge';
export { toolApi } from './tool-bridge';
export { globalApi } from './global-bridge';
export { modelsApi } from './models-bridge';
export { threadApi } from './thread-bridge';