import { RoleState } from '../../initialState';
import { RoleItem } from '@/services/roles';

// ========== 核心功能选择器 ==========

// 获取所有角色
export const selectRoles = (state: RoleState): RoleItem[] => state.roles;

// 获取当前角色
export const selectCurrentRole = (state: RoleState): RoleItem | null => state.currentRole;

// 获取角色映射表
export const selectRoleMap = (state: RoleState): Record<string, RoleItem> => state.roleMap;

// 根据ID获取角色
export const selectRoleById = (id: string) => (state: RoleState): RoleItem | undefined =>
  state.roleMap[id];

// 获取加载状态
export const selectLoading = (state: RoleState): boolean => state.loading;

// 获取错误信息
export const selectError = (state: RoleState): string | null => state.error;

// 获取角色数量
export const selectRoleCount = (state: RoleState): number => state.roles.length;

// 检查是否有角色数据
export const selectHasRoles = (state: RoleState): boolean => state.roles.length > 0;

// 获取角色名称映射（ID -> Name）
export const selectRoleNameMap = (state: RoleState): Record<string, string> => {
  const nameMap: Record<string, string> = {};
  state.roles.forEach(role => {
    nameMap[role.id] = role.name;
  });
  return nameMap;
};
