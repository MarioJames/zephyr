import { UserItem } from '@/services/user';
import { RoleItem } from '@/services/roles';

// ========== 全局类型定义 ==========
export interface EmployeeStatsItem {
  customerCount: number;
  messageCount: number;
  lastUpdated: string;
}

// ========== 全局状态接口 ==========
export interface EmployeeState {
  // === 核心功能状态 ===
  employees: UserItem[];
  roles: RoleItem[];
  loading: boolean;
  error: string | null;

  // === 统计功能状态 ===
  employeeStats: Record<string, EmployeeStatsItem>;
  statsLoading: boolean;

  // === 搜索功能状态 ===
  searchQuery: string;
  filteredEmployees: UserItem[];
  roleMap: Record<string, string>;

  // === 通知功能状态 ===
  notificationLoading: boolean;
  notificationError: string | null;
}

// ========== 初始状态 ==========
export const initialState: EmployeeState = {
  // === 核心功能初始状态 ===
  employees: [],
  roles: [],
  loading: false,
  error: null,

  // === 统计功能初始状态 ===
  employeeStats: {},
  statsLoading: false,

  // === 搜索功能初始状态 ===
  searchQuery: '',
  filteredEmployees: [],
  roleMap: {},

  // === 通知功能初始状态 ===
  notificationLoading: false,
  notificationError: null,
};
