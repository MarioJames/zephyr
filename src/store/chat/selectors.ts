import { ChatState } from './initialState';
import { messageSelectors } from './slices/message/selectors';
import { suggestionsSelectors } from './slices/agent_suggestions/selectors';
import { topicSelectors } from './slices/topic/selectors';

// 基础选择器
const error = (s: ChatState) => s.error;

const isCurrentChatLoaded = (s: ChatState): boolean => s.messagesInit;

const mainDisplayChatIDs = (s: ChatState): string[] =>
  s.messages
    .filter((msg) => msg.topicId === s.activeTopicId)
    .sort(
      (a, b) =>
        new Date(a.createdAt || 0).getTime() -
        new Date(b.createdAt || 0).getTime()
    )
    .map((msg) => msg.id);

// 话题相关选择器

// 聊天相关选择器
export const chatSelectors = {
  error,
  isCurrentChatLoaded,
  mainDisplayChatIDs,

  ...suggestionsSelectors,
  ...messageSelectors,
  ...topicSelectors,
};
