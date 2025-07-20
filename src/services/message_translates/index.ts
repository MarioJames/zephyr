import { http } from "../request";
import chatService from "../chat";

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
  return http.get<MessageTranslateItem>("/api/v1/message-translates", params);
}

/**
 * 翻译消息
 * @description 翻译指定的消息到目标语言，使用通用聊天接口实现
 * @param data MessageTranslateTriggerRequest
 * @returns MessageTranslateItem
 */
async function translateMessage(data: MessageTranslateTriggerRequest) {
  // 1. 先获取原始消息内容
  const originalMessage = await getMessageTranslate({ messageId: data.messageId });

  if (!originalMessage?.content) {
    throw new Error("未找到要翻译的消息内容");
  }

  // 2. 使用通用聊天接口进行翻译
  const translationResult = await chatService.translate({
    text: originalMessage.content,
    fromLanguage: data.from,
    toLanguage: data.to,
  });

  // 3. 保存翻译结果
  return http.post<MessageTranslateItem>("/api/v1/message-translates", {
    ...data,
    content: translationResult.content,
  });
}

export default {
  getMessageTranslate,
  translateMessage,
};
