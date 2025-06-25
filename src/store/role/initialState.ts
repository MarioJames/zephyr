import { CoreState, coreInitialState } from './slices/core/initialState';
import { PermissionsState, permissionsInitialState } from './slices/permissions/initialState';
import { FilterState, filterInitialState } from './slices/filter/initialState';

// ========== Role Store 总状态接口 ==========
export interface RoleState extends CoreState, PermissionsState, FilterState {}

// ========== 初始状态 ==========
export const initialState: RoleState = {
  ...coreInitialState,
  ...permissionsInitialState,
  ...filterInitialState,
};
