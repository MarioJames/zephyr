import { RoleState } from '../../initialState';

// ========== 权限管理选择器 ==========

// 获取所有权限缓存
export const selectPermissionsCache = (state: RoleState): Record<string, string[]> =>
  state.permissionsCache;

// 获取指定角色的权限
export const selectRolePermissions = (roleId: string) => (state: RoleState): string[] | undefined =>
  state.permissionsCache[roleId];

// 获取权限加载状态
export const selectPermissionsLoading = (roleId: string) => (state: RoleState): boolean =>
  state.permissionsLoading[roleId] || false;

// 获取权限错误信息
export const selectPermissionsError = (roleId: string) => (state: RoleState): string | null =>
  state.permissionsError[roleId] || null;

// 检查角色是否有特定权限
export const selectHasPermission = (roleId: string, permission: string) => (state: RoleState): boolean => {
  const permissions = state.permissionsCache[roleId];
  return permissions ? permissions.includes(permission) : false;
};

// 获取已缓存权限的角色ID列表
export const selectCachedRoleIds = (state: RoleState): string[] =>
  Object.keys(state.permissionsCache);

// 检查角色权限是否已缓存
export const selectIsPermissionsCached = (roleId: string) => (state: RoleState): boolean =>
  roleId in state.permissionsCache;

// 获取所有已缓存的权限（去重）
export const selectAllUniquePermissions = (state: RoleState): string[] => {
  const allPermissions = new Set<string>();
  Object.values(state.permissionsCache).forEach(permissions => {
    permissions.forEach(permission => allPermissions.add(permission));
  });
  return Array.from(allPermissions).sort();
};
