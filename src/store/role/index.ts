// ========== Role Store 导出入口 ==========

// 导出store hook
export { useRoleStore } from './store';
export type { RoleStore } from './store';

// 导出状态类型
export type { RoleState } from './initialState';
export type { CoreState } from './slices/core/initialState';
export type { PermissionsState } from './slices/permissions/initialState';
export type { FilterState } from './slices/filter/initialState';

// 导出action类型
export type { CoreAction } from './slices/core/action';
export type { PermissionsAction } from './slices/permissions/action';
export type { FilterAction } from './slices/filter/action';

// 导出所有选择器
export * from './selectors';
