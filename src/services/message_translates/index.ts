import { http } from "../request";

// 翻译相关类型定义
export interface MessageTranslateItem {
  id: string;
  content?: string;
  from?: string;
  to?: string;
  clientId?: string;
  userId: string;
}

export interface MessageTranslateQueryRequest {
  messageId: string; // 翻译内容关联的消息ID
}

export interface MessageTranslateTriggerRequest {
  messageId: string; // 翻译的消息ID
  from?: string; // 原始为何种语言
  to: string; // 翻译成何种语言
}

/**
 * 获取指定 Message 的翻译信息
 * @description 渲染用户信息录入的客户原始信息时，通过翻译组件触发请求：
 * 1如果返回的翻译内容为空，表示没有翻译过，调用下方的翻译接口，待翻译完成后再请求一次
 * 2如果翻译不为空，直接展示内容即可
 * @param params MessageTranslateQueryRequest
 * @returns MessageTranslateItem
 */
function queryTranslate(params: MessageTranslateQueryRequest) {
  return http.get<MessageTranslateItem>("/api/v1/message_translates/query", params);
}

/**
 * 翻译指定 Message
 * @description 渲染用户信息录入的客户原始信息时，通过翻译组件触发请求：
 * 1如果返回的翻译内容为空，表示没有翻译过，调用下方的翻译接口，待翻译完成后再请求一次
 * 2如果翻译不为空，直接展示内容即可
 * @param data MessageTranslateTriggerRequest
 * @returns void
 */
function triggerTranslate(data: MessageTranslateTriggerRequest) {
  return http.post<void>("/api/v1/message_translates/translate", data);
}

export default {
  queryTranslate,
  triggerTranslate,
}; 