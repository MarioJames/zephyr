import { UserItem } from '@/services/user';

// ========== 搜索功能状态接口 ==========
export interface SearchState {
  searchQuery: string;
  filteredEmployees: UserItem[];
  roleMap: Record<string, string>;
}

// ========== 搜索功能初始状态 ==========
export const searchInitialState: SearchState = {
  searchQuery: '',
  filteredEmployees: [],
  roleMap: {},
};
