import { CoreState, coreInitialState } from './slices/core/initialState';

// ========== Role Store 总状态接口 ==========
export interface RoleState extends CoreState {}

// ========== 初始状态 ==========
export const initialState: RoleState = {
  ...coreInitialState,
};
