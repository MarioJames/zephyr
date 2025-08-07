import { SessionItem } from '@/services/sessions';

export interface SessionCoreState {
  // 会话列表
  sessions: SessionItem[];

  // 搜索结果
  searchResults: SessionItem[];

  // 搜索关键词
  searchKeyword: string;
  // 加载状态
  isLoading: boolean;
  isSearching: boolean;
  // 初始化状态
  isInitialized: boolean;
  // 是否需要刷新数据（从客户管理页面返回时需要刷新）
  needsRefresh: boolean;
  // 错误信息
  error?: string;
  searchError?: string;
  inSearchMode: boolean;
}

export const sessionCoreInitialState: SessionCoreState = {
  sessions: [],
  searchResults: [],
  searchKeyword: '',
  isLoading: false,
  isSearching: false,
  isInitialized: false,
  needsRefresh: false,
  error: undefined,
  searchError: undefined,
  inSearchMode: false,
};
