import { SessionItem } from '@/services/sessions';

export interface SessionManagementState {
  // 会话列表
  sessions: SessionItem[];
  // 搜索结果
  searchResults: SessionItem[];
  // 置顶会话列表
  pinnedSessions: SessionItem[];
  // 分页信息
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  // 搜索关键词
  searchKeyword: string;
  // 加载状态
  isLoading: boolean;
  isSearching: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  // 错误信息
  error?: string;
  searchError?: string;
  inSearchMode: boolean;
  recentSessionIds: string[];
  recentSessionBlacklist: string[];
}

export const sessionManagementInitialState: SessionManagementState = {
  sessions: [],
  searchResults: [],
  pinnedSessions: [],
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: false,
  },
  searchKeyword: '',
  isLoading: false,
  isSearching: false,
  isCreating: false,
  isUpdating: false,
  error: undefined,
  searchError: undefined,
  inSearchMode: false,
  recentSessionIds: [],
  recentSessionBlacklist: [],
};
