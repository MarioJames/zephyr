import { request } from './index';
import type { ChatMessage } from '@/types/message';

export const chatApi = {
  /**
   * 创建助手消息
   * @param payload any 消息内容
   * @param options any 其他选项
   * @returns Promise<any> 消息结果
   */
  createAssistantMessage: (payload: any, options?: any) => request('/chat/createAssistantMessage', { ...payload, ...options }),
  /**
   * 创建助手消息流
   * @param payload any 消息内容
   * @returns Promise<any> 消息流结果
   */
  createAssistantMessageStream: (payload: any) => request('/chat/createAssistantMessageStream', payload),
  /**
   * 获取聊天补全
   * @param params any 参数
   * @param options any 其他选项
   * @returns Promise<any> 补全结果
   */
  getChatCompletion: (params: any, options?: any) => request('/chat/getChatCompletion', { ...params, ...options }),
  /**
   * 执行插件API
   * @param params any 参数
   * @param options any 其他选项
   * @returns Promise<any> 插件结果
   */
  runPluginApi: (params: any, options?: any) => request('/chat/runPluginApi', { ...params, ...options }),
  /**
   * 获取预设任务结果
   * @param params any 参数
   * @returns Promise<any> 任务结果
   */
  fetchPresetTaskResult: (params: any) => request('/chat/fetchPresetTaskResult', params),
}; 