import { UserItem } from '@/services/user';

// ========== 搜索功能状态接口 ==========
export interface SearchState {
  searchQuery: string;
  searchedEmployees: UserItem[];
  roleMap: Record<string, string>;
  pendingSearchKeys: Set<string>; // 正在进行中的搜索请求键
  // 分页相关状态
  currentPage: number;
  hasMore: boolean;
  loadingMore: boolean;
}

// ========== 搜索功能初始状态 ==========
export const searchInitialState: SearchState = {
  searchQuery: '',
  searchedEmployees: [],
  roleMap: {},
  pendingSearchKeys: new Set(),
  // 分页相关状态
  currentPage: 1,
  hasMore: true,
  loadingMore: false,
};
