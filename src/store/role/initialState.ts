import { CoreState, coreInitialState } from './slices/core/initialState';

// ========== Role Store 总状态接口 ==========
export type RoleState = CoreState

// ========== 初始状态 ==========
export const initialState: RoleState = {
  ...coreInitialState,
};
