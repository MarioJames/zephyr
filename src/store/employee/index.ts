import { useEmployeeStore } from './store';

export type { EmployeeState, EmployeeStatsItem } from './initialState';
export { employeeSelectors } from './selectors';
export type { EmployeeStore } from './store';
export { useEmployeeStore } from './store';

// 导出各slice的Action类型
export type { CoreAction } from './slices/core/action';
export type { NotificationAction } from './slices/notification/action';
export type { SearchAction } from './slices/search/action';

export const getEmployeeStoreState = () => useEmployeeStore.getState();
