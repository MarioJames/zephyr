// 导出主要的 store 和类型
export { useSessionStore } from './store';
export type { SessionStore } from './store';

// 导出状态类型
export type { SessionState } from './initialState';
export type { SessionManagementState } from './slices/session/initialState';
export type { NavigationState } from './slices/navigation/initialState';

// 导出操作类型
export type { SessionAction } from './slices/session/action';
export type { NavigationAction } from './slices/navigation/action';

// 导出选择器
export { sessionSelectors, sessionMetaSelectors } from './selectors';

// 导出辅助函数
export { sessionHelpers } from './helpers';
