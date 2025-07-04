import { agentSelectors, useAgentStore } from '@/store/agent';
import { ChatStore } from '../..';
import { MessageState } from './initialState';
import { MessageItem } from '@/services/messages';
import { chatHelpers } from '../../helpers';

export const inputMessage = (s: MessageState) => s.inputMessage;
export const messages = (s: MessageState) => s.messages;
export const messagesInit = (s: MessageState) => s.messagesInit;

export const getMessageById =
  (id: string) =>
  (s: MessageState): MessageItem | undefined =>
    s.messages.find((msg) => msg.id === id);

// 获取主消息，并根据历史配置进行切片
export const mainAIChatsWithHistoryConfig = (s: ChatStore): MessageItem[] => {
  const chats = messages(s);

  const [enableHistoryCount, historyCount] = useAgentStore((s) => [
    agentSelectors.enableHistoryCount(s),
    agentSelectors.historyCount(s),
  ]);

  return chatHelpers.getSlicedMessages(chats, {
    enableHistoryCount,
    historyCount,
  });
};
