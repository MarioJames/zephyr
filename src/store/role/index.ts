// ========== Role Store 导出入口 ==========

// 导出store hook
export { useRoleStore } from './store';
export type { RoleStore } from './store';

// 导出状态类型
export type { RoleState } from './initialState';
export type { CoreState } from './slices/core/initialState';

// 导出action类型
export type { CoreAction } from './slices/core/action';

// 导出所有选择器
export * from './selectors';
