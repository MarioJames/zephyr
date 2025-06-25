import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { CoreAction, coreSlice } from './slices/core/action';
import { StatsAction, statsSlice } from './slices/stats/action';
import { NotificationAction, notificationSlice } from './slices/notification/action';
import { SearchAction, searchSlice } from './slices/search/action';
import { EmployeeState, initialState } from './initialState';

// ========== 组合Store接口 ==========
export interface EmployeeStore
  extends EmployeeState,
          CoreAction,
          StatsAction,
          NotificationAction,
          SearchAction {}

// ========== Store创建器 ==========
const createStore: StateCreator<EmployeeStore> = (...parameters) => ({
  ...initialState,
  ...coreSlice(...parameters),
  ...statsSlice(...parameters),
  ...notificationSlice(...parameters),
  ...searchSlice(...parameters),
});

// ========== 导出store hook ==========
export const useEmployeeStore = create<EmployeeStore>()(createStore);
