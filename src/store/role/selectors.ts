// ========== Role Store 选择器汇总 ==========

// 导出核心功能选择器
export {
  selectRoles,
  selectCurrentRole,
  selectRoleMap,
  selectRoleById,
  selectLoading,
  selectError,
  selectRoleCount,
  selectHasRoles,
  selectRoleNameMap,
} from './slices/core/selectors';

// 导出权限管理选择器
export {
  selectPermissionsCache,
  selectRolePermissions,
  selectPermissionsLoading,
  selectPermissionsError,
  selectHasPermission,
  selectCachedRoleIds,
  selectIsPermissionsCached,
  selectAllUniquePermissions,
} from './slices/permissions/selectors';

// 导出过滤功能选择器
export {
  selectActiveRoles,
  selectFilteredRoles,
  selectNameFilter,
  selectPermissionFilters,
  selectShowActiveOnly,
  selectActiveRolesLoading,
  selectActiveRolesError,
  selectHasFilters,
  selectFilteredCount,
  selectActiveRoleCount,
  selectDisplayRoles,
} from './slices/filter/selectors';
