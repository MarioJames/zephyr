import { request } from './index';
import chatMock from '../mock/chat';
import type { ChatMessage } from '@/types/message';

export const chatApi = {
  /**
   * 创建助手消息
   * @param payload any 消息内容
   * @param options any 其他选项
   * @returns Promise<any> 消息结果
   */
  createAssistantMessage: (data: any) =>
    chatMock['/chat/createAssistantMessage']?.(data) || request('/chat/createAssistantMessage', data),
  /**
   * 创建助手消息流
   * @param payload any 消息内容
   * @returns Promise<any> 消息流结果
   */
  createAssistantMessageStream: (data: any) =>
    chatMock['/chat/createAssistantMessageStream']?.(data) || request('/chat/createAssistantMessageStream', data),
  /**
   * 获取聊天补全
   * @param params any 参数
   * @param options any 其他选项
   * @returns Promise<any> 补全结果
   */
  getChatCompletion: (data: any) =>
    chatMock['/chat/getChatCompletion']?.(data) || request('/chat/getChatCompletion', data),
  /**
   * 执行插件API
   * @param params any 参数
   * @param options any 其他选项
   * @returns Promise<any> 插件结果
   */
  runPluginApi: (data: any) =>
    chatMock['/chat/runPluginApi']?.(data) || request('/chat/runPluginApi', data),
  /**
   * 获取预设任务结果
   * @param params any 参数
   * @returns Promise<any> 任务结果
   */
  fetchPresetTaskResult: (data: any) =>
    chatMock['/chat/fetchPresetTaskResult']?.(data) || request('/chat/fetchPresetTaskResult', data),
}; 