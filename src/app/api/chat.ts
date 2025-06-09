import { request } from './index';
import type { ChatMessage } from '@/types/message';

export const chatApi = {
  createAssistantMessage: (payload: any, options?: any) => request('/chat/createAssistantMessage', { ...payload, ...options }),
  createAssistantMessageStream: (payload: any) => request('/chat/createAssistantMessageStream', payload),
  getChatCompletion: (params: any, options?: any) => request('/chat/getChatCompletion', { ...params, ...options }),
  runPluginApi: (params: any, options?: any) => request('/chat/runPluginApi', { ...params, ...options }),
  fetchPresetTaskResult: (params: any) => request('/chat/fetchPresetTaskResult', params),
}; 