import { http } from '../request';

// 翻译相关类型定义
export interface MessageTranslateItem {
  id: string;
  content: string;
  from: string;
  to: string;
  clientId?: string;
  userId: string;
}

export interface MessageTranslateQueryRequest {
  messageId: string; // 翻译内容关联的消息ID
}

export interface MessageTranslateTriggerRequest {
  messageId: string; // 翻译的消息ID
  from: string; // 源语言
  to: string; // 目标语言
}

/**
 * 获取消息翻译
 * @description 获取指定消息的翻译信息
 * @param params MessageTranslateQueryRequest
 * @returns MessageTranslateItem
 */
function getMessageTranslate(params: MessageTranslateQueryRequest) {
  return http.get<MessageTranslateItem>('/api/v1/message-translates', params);
}

/**
 * 翻译消息
 * @description 翻译指定的消息到目标语言
 * @param data MessageTranslateTriggerRequest
 * @returns MessageTranslateItem
 */
function translateMessage(data: MessageTranslateTriggerRequest) {
  return http.post<MessageTranslateItem>('/api/v1/message-translates', data);
}

export default {
  getMessageTranslate,
  translateMessage,
};
