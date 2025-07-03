import { useEmployeeStore } from './store';

export { useEmployeeStore } from './store';
export type { EmployeeStore } from './store';
export { employeeSelectors } from './selectors';
export type { EmployeeState, EmployeeStatsItem } from './initialState';

// 导出各slice的Action类型
export type { CoreAction } from './slices/core/action';
export type { NotificationAction } from './slices/notification/action';
export type { SearchAction } from './slices/search/action';

export const getEmployeeStoreState = () => useEmployeeStore.getState();
