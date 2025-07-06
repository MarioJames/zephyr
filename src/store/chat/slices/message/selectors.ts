import { MessageState } from './initialState';
import { MessageItem } from '@/services/messages';
import { chatHelpers } from '../../helpers';

const messagesInit = (s: MessageState) => s.messagesInit;
const fetchMessageLoading = (s: MessageState) => s.fetchMessageLoading;
const sendMessageLoading = (s: MessageState) => s.sendMessageLoading;
const inputMessage = (s: MessageState) => s.inputMessage;
const messages = (s: MessageState) => s.messages;

const getMessageById =
  (id: string) =>
  (s: MessageState): MessageItem | undefined =>
    s.messages.find((msg) => msg.id === id);

// 获取主消息，并根据历史配置进行切片
const mainAIChatsWithHistoryConfig = (
  s: MessageState,
  {
    enableHistoryCount,
    historyCount,
  }: {
    enableHistoryCount: boolean;
    historyCount: number;
  }
): MessageItem[] => {
  const chats = messages(s);

  return chatHelpers.getSlicedMessages(chats, {
    enableHistoryCount,
    historyCount,
  });
};

const translatingMessageIds = (s: MessageState) => s.translatingMessageIds;
const isMessageTranslating = (id: string) => (s: MessageState) =>
  s.translatingMessageIds.includes(id);

export const messageSelectors = {
  inputMessage,
  messages,
  messagesInit,
  getMessageById,
  fetchMessageLoading,
  sendMessageLoading,
  mainAIChatsWithHistoryConfig,

  // 翻译状态相关选择器
  translatingMessageIds,
  isMessageTranslating,
};
