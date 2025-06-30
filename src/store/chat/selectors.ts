import { ChatState } from './initialState';
import { MessageItem } from '@/services/messages';
import { TopicItem } from '@/services/topics';

// 基础选择器
const activeTopicId = (s: ChatState) => s.activeTopicId;
const inputMessage = (s: ChatState) => s.inputMessage;
const isLoading = (s: ChatState) => s.isLoading;
const error = (s: ChatState) => s.error;

// 消息相关选择器
const messages = (s: ChatState) => s.messages;
const messagesInit = (s: ChatState) => s.messagesInit;

const getMessageById =
  (id: string) =>
  (s: ChatState): MessageItem | undefined =>
    s.messages.find((msg) => msg.id === id);

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
const topics = (s: ChatState) => s.topics;
const topicsInit = (s: ChatState) => s.topicsInit;
const searchTopics = (s: ChatState) => s.searchTopics;
const isSearchingTopic = (s: ChatState) => s.isSearchingTopic;
const inSearchingMode = (s: ChatState) => s.inSearchingMode;
const isInSearchMode = (s: ChatState) => s.inSearchingMode;
const topicRenamingId = (s: ChatState) => s.topicRenamingId;

const currentActiveTopic = (s: ChatState): TopicItem | undefined =>
  s.topics.find((topic) => topic.id === s.activeTopicId);

// 判断某条消息是否正在编辑
const isMessageEditing = (id: string) => (s: ChatState) =>
  s.editingMessageId === id;

// 判断某条消息是否正在生成中
const isMessageGenerating = (id: string) => (s: ChatState) =>
  s.generatingMessageId === id;

// 翻译状态相关选择器
const translatingMessageIds = (s: ChatState) => s.translatingMessageIds;
const isMessageTranslating = (id: string) => (s: ChatState) =>
  s.translatingMessageIds.includes(id);

// 聊天相关选择器
export const chatSelectors = {
  activeTopicId,
  inputMessage,
  isLoading,
  error,
  messages,
  messagesInit,
  getMessageById,
  isCurrentChatLoaded,
  mainDisplayChatIDs,
  isMessageEditing,
  isMessageGenerating,
  translatingMessageIds,
  isMessageTranslating,
};

// 话题相关选择器
export const topicSelectors = {
  topics,
  topicsInit,
  searchTopics,
  isSearchingTopic,
  inSearchingMode,
  isInSearchMode,
  topicRenamingId,
  currentActiveTopic,
};
