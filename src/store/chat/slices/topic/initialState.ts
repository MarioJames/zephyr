import { ChatTopic } from '@/types/topic';

/**
 * 聊天话题状态接口
 * 定义了聊天话题相关的所有状态字段
 */
export interface ChatTopicState {
  /**
   * 当前活动的话题ID
   * 表示当前选中的话题
   * TODO: 需要添加null到类型定义中
   */
  activeTopicId?: string;
  
  /**
   * 是否正在创建话题
   * 标识当前是否处于话题创建状态
   */
  creatingTopic: boolean;
  
  /**
   * 是否处于搜索模式
   * 标识当前是否在搜索话题
   */
  inSearchingMode?: boolean;
  
  /**
   * 是否正在搜索话题
   * 标识是否正在进行话题搜索操作
   */
  isSearchingTopic: boolean;
  
  /**
   * 搜索结果话题列表
   * 存储话题搜索的结果
   */
  searchTopics: ChatTopic[];
  
  /**
   * 话题加载中的ID列表
   * 存储所有正在加载的话题ID
   */
  topicLoadingIds: string[];
  
  /**
   * 话题映射表
   * 以会话ID为键，存储每个会话的话题列表
   * 格式：{ sessionId: ChatTopic[] }
   */
  topicMaps: Record<string, ChatTopic[]>;
  
  /**
   * 正在重命名的话题ID
   * 存储当前正在重命名的话题ID
   */
  topicRenamingId?: string;
  
  /**
   * 话题搜索关键词
   * 当前话题搜索使用的关键词
   */
  topicSearchKeywords: string;
  
  /**
   * 话题是否已初始化
   * 标识话题数据是否已经完成首次获取
   */
  topicsInit: boolean;
}

/**
 * 聊天话题状态的初始值
 * 设置所有话题相关字段的默认值
 */
export const initialTopicState: ChatTopicState = {
  activeTopicId: null as any, // 默认活动话题为null
  creatingTopic: false, // 默认不在创建话题状态
  isSearchingTopic: false, // 默认不在搜索话题状态
  searchTopics: [], // 默认搜索结果为空
  topicLoadingIds: [], // 默认话题加载列表为空
  topicMaps: {}, // 默认话题映射表为空
  topicSearchKeywords: '', // 默认话题搜索关键词为空
  topicsInit: false, // 默认话题未初始化
};
