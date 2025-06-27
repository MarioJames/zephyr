import { CustomerItem } from '@/services/customer';
import { AgentItem } from '@/services/agents';

// ========== 客户统计数据接口 ==========
export interface CustomerStatsItem {
  total: number;
  byCategory: Record<string, number>;
  lastUpdated: string;
}

// ========== 全局状态接口 ==========
export interface CustomerState {
  // === 核心功能状态 ===
  customers: CustomerItem[];
  currentCustomer?: CustomerItem;
  loading: boolean;
  error: string | null;

  // === 统计功能状态 ===
  customerStats: CustomerStatsItem;
  statsLoading: boolean;

  // === 搜索功能状态 ===
  searchQuery: string;
  filteredCustomers: CustomerItem[];
  currentPage: number;
  pageSize: number;
  total: number;
  sortField: string;
  sortOrder: 'asc' | 'desc' | '';

  // === 分类功能状态 ===
  selectedCategory: string;
  categoryStats: Record<string, number>;
  agents: AgentItem[];
}

// ========== 初始状态 ==========
export const initialState: CustomerState = {
  // === 核心功能初始状态 ===
  customers: [],
  currentCustomer: undefined,
  loading: false,
  error: null,

  // === 统计功能初始状态 ===
  customerStats: {
    total: 0,
    byCategory: {},
    lastUpdated: '',
  },
  statsLoading: false,

  // === 搜索功能初始状态 ===
  searchQuery: '',
  filteredCustomers: [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
  sortField: '',
  sortOrder: '',

  // === 分类功能初始状态 ===
  selectedCategory: 'all',
  categoryStats: {},
  agents: [],
};
