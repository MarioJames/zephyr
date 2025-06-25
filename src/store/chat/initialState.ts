import { MessageItem } from '@/services';
import { TopicItem } from '@/services/topics';

export interface ChatState {
  // 当前激活的会话ID
  activeId: string;
  // 当前激活的话题ID
  activeTopicId?: string;

  // 消息相关
  messages: MessageItem[];
  messagesInit: boolean;
  inputMessage: string;

  // 话题相关
  topics: TopicItem[];
  topicsInit: boolean;
  isSearchingTopic: boolean;
  searchTopics: TopicItem[];
  inSearchingMode: boolean;
  topicRenamingId?: string;

  // 简化后的加载状态（移除AI生成状态，因为我们的对话都是确定内容）

  // 其他状态
  isLoading: boolean;
  error?: string;
}

export const initialState: ChatState = {
  activeId: '',
  activeTopicId: undefined,

  messages: [],
  messagesInit: false,
  inputMessage: '',

  topics: [],
  topicsInit: false,
  isSearchingTopic: false,
  searchTopics: [],
  inSearchingMode: false,
  topicRenamingId: undefined,

  isLoading: false,
  error: undefined,
};
