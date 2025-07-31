// 重新导出各个 slice 的类型和初始状态，保持向后兼容性
import { GeneralState, generalInitialState } from './slices/general/initialState';
import { UserState, userInitialState } from './slices/user/initialState';
import { WorkspaceState, workspaceInitialState } from './slices/workspace/initialState';

export * from './slices/general/initialState';
export * from './slices/user/initialState';
export * from './slices/workspace/initialState';

/**
 * 全局状态接口
 * 通过交叉类型(&)将所有 slice 的状态组合在一起
 */
export interface GlobalState extends GeneralState, UserState, WorkspaceState {}

/**
 * 全局初始状态
 * 合并所有 slice 的初始状态
 */
export const initialState: GlobalState = {
  ...generalInitialState,
  ...userInitialState,
  ...workspaceInitialState,
};