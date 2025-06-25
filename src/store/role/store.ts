import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { CoreAction, coreSlice } from './slices/core/action';
import { PermissionsAction, permissionsSlice } from './slices/permissions/action';
import { FilterAction, filterSlice } from './slices/filter/action';
import { RoleState, initialState } from './initialState';

// ========== 组合Store接口 ==========
export interface RoleStore
  extends RoleState,
          CoreAction,
          PermissionsAction,
          FilterAction {}

// ========== Store创建器 ==========
const createStore: StateCreator<RoleStore> = (...parameters) => ({
  ...initialState,
  ...coreSlice(...parameters),
  ...permissionsSlice(...parameters),
  ...filterSlice(...parameters),
});

// ========== 导出store hook ==========
export const useRoleStore = create<RoleStore>()(createStore);
