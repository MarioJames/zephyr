import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { CoreAction, coreSlice } from './slices/core/action';
import { PermissionsAction, permissionsSlice } from './slices/permissions/action';
import { FilterAction, filterSlice } from './slices/filter/action';
import { RoleState, initialState } from './initialState';
import { createDevtools } from '@/utils/store';

// ========== 组合Store接口 ==========
export interface RoleStore
  extends RoleState,
          CoreAction,
          PermissionsAction,
          FilterAction {}

// ========== Store创建器 ==========
const createStore: StateCreator<RoleStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...coreSlice(...parameters),
  ...permissionsSlice(...parameters),
  ...filterSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('role');

// ========== 导出store hook ==========
export const useRoleStore = createWithEqualityFn<RoleStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
