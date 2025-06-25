import { RoleItem } from '@/services/roles';

// ========== 过滤功能状态接口 ==========
export interface FilterState {
  // 活跃角色列表
  activeRoles: RoleItem[];
  // 过滤后的角色列表
  filteredRoles: RoleItem[];
  // 名称过滤条件
  nameFilter: string;
  // 权限过滤条件
  permissionFilters: string[];
  // 是否只显示活跃角色
  showActiveOnly: boolean;
  // 活跃角色加载状态
  activeRolesLoading: boolean;
  // 活跃角色错误信息
  activeRolesError: string | null;
}

// ========== 过滤功能初始状态 ==========
export const filterInitialState: FilterState = {
  activeRoles: [],
  filteredRoles: [],
  nameFilter: '',
  permissionFilters: [],
  showActiveOnly: false,
  activeRolesLoading: false,
  activeRolesError: null,
};
