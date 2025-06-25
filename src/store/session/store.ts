import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { SessionState, initialState } from './initialState';
import { SessionManagementState, sessionManagementInitialState } from './slices/session/initialState';
import { NavigationState, navigationInitialState } from './slices/navigation/initialState';
import { SessionAction, sessionSlice } from './slices/session/action';
import { NavigationAction, navigationSlice } from './slices/navigation/action';

// 组合所有状态接口
export interface SessionStore extends
  SessionState,
  SessionManagementState,
  NavigationState,
  SessionAction,
  NavigationAction {}

// 创建完整的初始状态
const combinedInitialState = {
  ...initialState,
  ...sessionManagementInitialState,
  ...navigationInitialState,
};

// 创建 store 工厂函数
const createStore: StateCreator<SessionStore> = (...parameters) => ({
  ...combinedInitialState,
  ...sessionSlice(...parameters),
  ...navigationSlice(...parameters),
});

// 导出 useSessionStore hook
export const useSessionStore = create<SessionStore>()(createStore);
