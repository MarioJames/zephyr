import { CustomerItem } from '@/services/customer';

// ========== 搜索功能状态接口 ==========
export interface SearchState {
  searchQuery: string;
  filteredCustomers: CustomerItem[];
  currentPage: number;
  pageSize: number;
  sortField: string;
  sortOrder: 'asc' | 'desc' | '';
}

// ========== 搜索功能初始状态 ==========
export const searchInitialState: SearchState = {
  searchQuery: '',
  filteredCustomers: [],
  currentPage: 1,
  pageSize: 10,
  sortField: '',
  sortOrder: '',
};
