import { RoleState } from '../../initialState';
import { RoleItem } from '@/services/roles';

// ========== 核心功能选择器 ==========

// 获取当前角色
export const currentRole = (state: RoleState): RoleItem | null =>
  state.currentRole;

// 获取所有角色
export const allRoles = (state: RoleState): RoleItem[] => state.roles;

// 激活的角色
export const activeRoles = (state: RoleState): RoleItem[] =>
  state.roles.filter((role) => role.isActive);

// 获取加载状态
export const selectLoading = (state: RoleState): boolean => state.loading;

// 获取错误信息
export const selectError = (state: RoleState): string | null => state.error;

// 获取角色数量
export const selectRoleCount = (state: RoleState): number => state.roles.length;
