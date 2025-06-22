import { ChatMessage } from '@/types/message';
import { OpenAIChatMessage } from '@/types/openai/chat';
import { encodeAsync } from '@/utils/tokenizer';

/**
 * 获取消息列表的token数量
 * 将消息内容连接后计算token数量，用于控制API请求长度
 * @param messages - OpenAI格式的聊天消息数组
 * @returns Promise<number> - 消息内容的token数量
 */
export const getMessagesTokenCount = async (messages: OpenAIChatMessage[]) =>
  encodeAsync(messages.map((m) => m.content).join(''));

/**
 * 根据ID获取指定消息
 * 在消息数组中查找指定ID的消息
 * @param messages - 聊天消息数组
 * @param id - 要查找的消息ID
 * @returns ChatMessage | undefined - 找到的消息或undefined
 */
export const getMessageById = (messages: ChatMessage[], id: string) =>
  messages.find((m) => m.id === id);

/**
 * 获取切片消息列表
 * 根据历史记录数量限制返回指定数量的消息
 * @param messages - 完整的消息数组
 * @param options - 切片选项
 * @param options.enableHistoryCount - 是否启用历史记录数量限制
 * @param options.historyCount - 历史记录数量
 * @param options.includeNewUserMessage - 是否包含新的用户消息
 * @returns ChatMessage[] - 切片后的消息数组
 */
const getSlicedMessages = (
  messages: ChatMessage[],
  options: {
    enableHistoryCount?: boolean;
    historyCount?: number;
    includeNewUserMessage?: boolean;
  },
): ChatMessage[] => {
  // 如果未启用历史记录数量限制，返回所有消息
  if (!options.enableHistoryCount || options.historyCount === undefined) return messages;

  // 如果用户发送消息，历史记录会包含这条消息，所以总长度应该+1
  const messagesCount = !!options.includeNewUserMessage
    ? options.historyCount + 1
    : options.historyCount;

  // 如果历史记录数量为负数或0，返回空数组
  if (messagesCount <= 0) return [];

  // 如果历史记录数量为正数，返回最后N条消息
  return messages.slice(-messagesCount);
};

/**
 * 聊天辅助函数集合
 * 提供聊天相关的工具函数
 */
export const chatHelpers = {
  getMessageById,
  getMessagesTokenCount,
  getSlicedMessages,
};
