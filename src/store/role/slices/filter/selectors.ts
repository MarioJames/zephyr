import { RoleState } from '../../initialState';
import { RoleItem } from '@/services/roles';

// ========== 过滤功能选择器 ==========

// 获取活跃角色列表
export const selectActiveRoles = (state: RoleState): RoleItem[] => state.activeRoles;

// 获取过滤后的角色列表
export const selectFilteredRoles = (state: RoleState): RoleItem[] => state.filteredRoles;

// 获取名称过滤条件
export const selectNameFilter = (state: RoleState): string => state.nameFilter;

// 获取权限过滤条件
export const selectPermissionFilters = (state: RoleState): string[] => state.permissionFilters;

// 获取是否只显示活跃角色
export const selectShowActiveOnly = (state: RoleState): boolean => state.showActiveOnly;

// 获取活跃角色加载状态
export const selectActiveRolesLoading = (state: RoleState): boolean => state.activeRolesLoading;

// 获取活跃角色错误信息
export const selectActiveRolesError = (state: RoleState): string | null => state.activeRolesError;

// 检查是否有过滤条件
export const selectHasFilters = (state: RoleState): boolean => {
  return !!(
    state.nameFilter ||
    state.permissionFilters.length > 0 ||
    state.showActiveOnly
  );
};

// 获取过滤结果数量
export const selectFilteredCount = (state: RoleState): number => state.filteredRoles.length;

// 获取活跃角色数量
export const selectActiveRoleCount = (state: RoleState): number => state.activeRoles.length;

// 获取当前显示的角色列表（如果有过滤则返回过滤结果，否则返回全部）
export const selectDisplayRoles = (state: RoleState): RoleItem[] => {
  const hasFilters = selectHasFilters(state);
  if (hasFilters) {
    return state.filteredRoles;
  }
  return state.showActiveOnly ? state.activeRoles : state.roles;
};
