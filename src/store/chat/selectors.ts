import { ChatState } from './initialState';
import { messageSelectors } from './slices/message/selectors';
import { suggestionsSelectors } from './slices/agent_suggestions/selectors';
import { topicSelectors } from './slices/topic/selectors';

// 基础选择器
const error = (s: ChatState) => s.error;

const isCurrentChatLoaded = (s: ChatState): boolean => s.messagesInit;

// 话题相关选择器

// 聊天相关选择器
export const chatSelectors = {
  error,
  isCurrentChatLoaded,

  ...suggestionsSelectors,
  ...messageSelectors,
  ...topicSelectors,
};
