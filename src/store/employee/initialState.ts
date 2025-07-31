import { SearchState , searchInitialState } from './slices/search/initialState';
import { CoreState , coreInitialState } from './slices/core/initialState';
import { NotificationState , notificationInitialState } from './slices/notification/initialState';

// ========== 全局类型定义 ==========
export interface EmployeeStatsItem {
  customerCount: number;
  messageCount: number;
  lastUpdated: string;
}

// ========== 全局状态接口 ==========
export type EmployeeState = SearchState & CoreState & NotificationState;

// ========== 初始状态 ==========
export const initialState: EmployeeState = {
  ...searchInitialState,
  ...coreInitialState,
  ...notificationInitialState,
};
