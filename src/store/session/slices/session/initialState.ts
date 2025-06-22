import { LobeAgentSession } from '@/types/session';

/**
 * 会话状态接口
 * 定义了会话相关的所有状态字段
 */
export interface SessionState {
  /**
   * 当前活动的会话ID
   * 表示当前正在编辑或查看的会话
   * 默认值为'inbox'，表示收件箱
   */
  activeId: string;
  
  /**
   * 默认会话列表
   * 包含系统预设的默认会话，如收件箱等
   */
  defaultSessions: LobeAgentSession[];
  
  /**
   * 是否正在搜索
   * 标识当前是否处于搜索状态
   */
  isSearching: boolean;
  
  /**
   * 会话首次获取是否完成
   * 用于标识会话数据的初始加载状态
   */
  isSessionsFirstFetchFinished: boolean;
  
  /**
   * 置顶会话列表
   * 包含用户置顶的重要会话
   */
  pinnedSessions: LobeAgentSession[];
  
  /**
   * 搜索关键词
   * 当前搜索使用的关键词
   */
  searchKeywords: string;
  
  /**
   * 会话搜索关键词
   * 专门用于会话搜索的关键词
   */
  sessionSearchKeywords?: string;
  
  /**
   * 会话列表
   * 等同于defaultSessions，包含所有会话
   */
  sessions: LobeAgentSession[];
  
  /**
   * 会话元数据信号控制器
   * 用于取消正在进行的会话元数据更新操作
   */
  signalSessionMeta?: AbortController;
}

/**
 * 会话状态的初始值
 * 设置所有会话相关字段的默认值
 */
export const initialSessionState: SessionState = {
  activeId: 'inbox', // 默认活动会话为收件箱
  defaultSessions: [], // 默认会话列表为空
  isSearching: false, // 默认不在搜索状态
  isSessionsFirstFetchFinished: false, // 默认首次获取未完成
  pinnedSessions: [], // 默认置顶会话为空
  searchKeywords: '', // 默认搜索关键词为空
  sessions: [], // 默认会话列表为空
};
