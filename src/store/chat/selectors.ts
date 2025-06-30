import { ChatState } from './initialState';
import { MessageItem } from '@/services/messages';
import { TopicItem } from '@/services/topics';

// 基础选择器
const activeId = (s: ChatState) => s.activeSessionId;
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
    .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
    .map((msg) => msg.id);

const showInboxWelcome = (s: ChatState): boolean =>
  s.messages.length === 0 && s.messagesInit;

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

const currentTopicLength = (s: ChatState): number => s.topics.length;

const isUndefinedTopics = (s: ChatState): boolean =>
  s.topicsInit && s.topics.length === 0;

const groupedTopicsSelector = (s: ChatState) => {
  const topics = s.topics;
  if (!topics.length) return [];

  // 按日期分组话题
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups = [
    { title: '今天', topics: [] as TopicItem[] },
    { title: '昨天', topics: [] as TopicItem[] },
    { title: '过去7天', topics: [] as TopicItem[] },
    { title: '过去30天', topics: [] as TopicItem[] },
    { title: '更早', topics: [] as TopicItem[] },
  ];

  topics.forEach((topic) => {
    const topicDate = new Date(topic.createdAt || 0);

    if (topicDate >= today) {
      groups[0].topics.push(topic);
    } else if (topicDate >= yesterday) {
      groups[1].topics.push(topic);
    } else if (topicDate >= sevenDaysAgo) {
      groups[2].topics.push(topic);
    } else if (topicDate >= thirtyDaysAgo) {
      groups[3].topics.push(topic);
    } else {
      groups[4].topics.push(topic);
    }
  });

  return groups.filter((group) => group.topics.length > 0);
};

// 判断某条消息是否正在编辑
const isMessageEditing = (id: string) => (s: ChatState) => s.editingMessageId === id;

// 判断某条消息是否正在生成中
const isMessageGenerating = (id: string) => (s: ChatState) => s.generatingMessageId === id;

// 翻译状态相关选择器
const translatingMessageIds = (s: ChatState) => s.translatingMessageIds;
const isMessageTranslating = (id: string) => (s: ChatState) => 
  s.translatingMessageIds.includes(id);

// 聊天相关选择器
export const chatSelectors = {
  activeId,
  activeTopicId,
  inputMessage,
  isLoading,
  error,
  messages,
  messagesInit,
  getMessageById,
  isCurrentChatLoaded,
  mainDisplayChatIDs,
  showInboxWelcome,
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
  currentTopicLength,
  isUndefinedTopics,
  groupedTopicsSelector,
};
