import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { CoreAction, coreSlice } from './slices/core/action';
import { CategoryAction, categorySlice } from './slices/category/action';
import { CustomerState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

// ========== 组合Store接口 ==========
export interface CustomerStore
  extends CustomerState,
    CoreAction,
    CategoryAction {}

// ========== Store创建器 ==========
const createStore: StateCreator<
  CustomerStore,
  [['zustand/devtools', never]]
> = (...parameters) => ({
  ...initialState,
  ...coreSlice(...parameters),
  ...categorySlice(...parameters),
});

// ========== 实装 useStore ============ //

const devtools = createDevtools('customer');

// 导出 useCustomerStore hook
export const useCustomerStore = createWithEqualityFn<CustomerStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
