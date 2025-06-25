import { MessageItem } from '@/services/messages';
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
  
  // 生成状态
  isAIGenerating: boolean;
  abortController?: AbortController;
  
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
  
  isAIGenerating: false,
  abortController: undefined,
  
  isLoading: false,
  error: undefined,
};