import { request } from './index';
import type { ChatMessage } from '@/types/message';

export const messageApi = {
  /**
   * 创建消息
   * @param params any 消息参数
   * @returns Promise<{id: string, content: string}> 消息对象
   */
  createMessage: (params: any) => request('/message/createMessage', params),
  /**
   * 批量创建消息
   * @param messages any 消息数组
   * @returns Promise<any> 结果
   */
  batchCreateMessages: (messages: any) => request('/message/batchCreateMessages', { messages }),
  /**
   * 获取消息列表
   * @param sessionId string 会话ID
   * @param topicId string 主题ID
   * @returns Promise<ChatMessage[]> 消息数组
   */
  getMessages: (sessionId: string, topicId: string) => request('/message/getMessages', { sessionId, topicId }),
  /**
   * 获取所有消息
   * @returns Promise<ChatMessage[]> 消息数组
   */
  getAllMessages: () => request('/message/getAllMessages', {}),
  /**
   * 统计消息数量
   * @param params any 可选参数
   * @returns Promise<number> 数量
   */
  countMessages: (params: any) => request('/message/countMessages', params),
  /**
   * 统计词数
   * @param params any 可选参数
   * @returns Promise<number> 词数
   */
  countWords: (params: any) => request('/message/countWords', params),
  /**
   * 获取模型排行
   * @returns Promise<any[]> 排行数组
   */
  rankModels: () => request('/message/rankModels', {}),
  /**
   * 获取热力图
   * @returns Promise<any[]> 热力图数据
   */
  getHeatmaps: () => request('/message/getHeatmaps', {}),
  /**
   * 获取会话下所有消息
   * @param sessionId string 会话ID
   * @returns Promise<ChatMessage[]> 消息数组
   */
  getAllMessagesInSession: (sessionId: string) => request('/message/getAllMessagesInSession', { sessionId }),
  /**
   * 更新消息错误
   * @param id string 消息ID
   * @param error any 错误内容
   * @returns Promise<any>
   */
  updateMessageError: (id: string, error: any) => request('/message/updateMessageError', { id, error }),
  /**
   * 更新消息内容
   * @param id string 消息ID
   * @param message any 消息内容
   * @returns Promise<any>
   */
  updateMessage: (id: string, message: any) => request('/message/updateMessage', { id, message }),
  /**
   * 更新消息TTS
   * @param id string 消息ID
   * @param tts any TTS内容
   * @returns Promise<any>
   */
  updateMessageTTS: (id: string, tts: any) => request('/message/updateMessageTTS', { id, tts }),
  /**
   * 更新消息翻译
   * @param id string 消息ID
   * @param translate any 翻译内容
   * @returns Promise<any>
   */
  updateMessageTranslate: (id: string, translate: any) => request('/message/updateMessageTranslate', { id, translate }),
  /**
   * 更新消息插件状态
   * @param id string 消息ID
   * @param value any 状态
   * @returns Promise<any>
   */
  updateMessagePluginState: (id: string, value: any) => request('/message/updateMessagePluginState', { id, value }),
  /**
   * 更新消息插件错误
   * @param id string 消息ID
   * @param value any 错误内容
   * @returns Promise<any>
   */
  updateMessagePluginError: (id: string, value: any) => request('/message/updateMessagePluginError', { id, value }),
  /**
   * 更新消息插件参数
   * @param id string 消息ID
   * @param value any 参数
   * @returns Promise<any>
   */
  updateMessagePluginArguments: (id: string, value: any) => request('/message/updateMessagePluginArguments', { id, value }),
  /**
   * 删除单条消息
   * @param id string 消息ID
   * @returns Promise<any>
   */
  removeMessage: (id: string) => request('/message/removeMessage', { id }),
  /**
   * 批量删除消息
   * @param ids string[] 消息ID数组
   * @returns Promise<any>
   */
  removeMessages: (ids: string[]) => request('/message/removeMessages', { ids }),
  /**
   * 删除助手相关消息
   * @param sessionId string 会话ID
   * @param topicId string 主题ID
   * @returns Promise<any>
   */
  removeMessagesByAssistant: (sessionId: string, topicId: string) => request('/message/removeMessagesByAssistant', { sessionId, topicId }),
  /**
   * 删除所有消息
   * @returns Promise<any>
   */
  removeAllMessages: () => request('/message/removeAllMessages', {}),
  /**
   * 是否有消息
   * @returns Promise<boolean>
   */
  hasMessages: () => request('/message/hasMessages', {}),
  /**
   * 检查消息数量是否达到埋点阈值
   * @returns Promise<number>
   */
  messageCountToCheckTrace: () => request('/message/messageCountToCheckTrace', {}),
}; 