import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { CoreAction, coreSlice } from './slices/core/action';
import {
  NotificationAction,
  notificationSlice,
} from './slices/notification/action';
import { SearchAction, searchSlice } from './slices/search/action';
import { EmployeeState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

// ========== 组合Store接口 ==========
export interface EmployeeStore
  extends EmployeeState,
    CoreAction,
    NotificationAction,
    SearchAction {}

// ========== Store创建器 ==========
const createStore: StateCreator<
  EmployeeStore,
  [['zustand/devtools', never]]
> = (...parameters) => ({
  ...initialState,
  ...coreSlice(...parameters),
  ...notificationSlice(...parameters),
  ...searchSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('employee');

// ========== 导出store hook ==========
export const useEmployeeStore = createWithEqualityFn<EmployeeStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
