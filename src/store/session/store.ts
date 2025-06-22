import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { SessionStoreState, initialState } from './initialState';
import { SessionAction, createSessionSlice } from './slices/session/action';
import { SessionGroupAction, createSessionGroupSlice } from './slices/sessionGroup/action';

//  ===============  聚合 createStoreFn ============ //

/**
 * 会话Store的完整类型定义
 * 通过交叉类型(&)将所有状态和操作组合在一起
 * 包含以下模块：
 * - SessionAction: 会话相关操作
 * - SessionGroupAction: 会话分组相关操作
 * - SessionStoreState: 会话状态数据
 */
export interface SessionStore extends SessionAction, SessionGroupAction, SessionStoreState {}

/**
 * 创建会话Store的工厂函数
 * 将所有slice的状态和操作合并成一个完整的store
 * @param parameters - Zustand的创建参数
 * @returns 完整的会话store对象
 */
const createStore: StateCreator<SessionStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createSessionSlice(...parameters),
  ...createSessionGroupSlice(...parameters),
});

//  ===============  implement useStore ============ //

// 创建开发工具中间件实例，用于调试会话store
const devtools = createDevtools('session');

/**
 * 会话Store的React Hook
 * 使用createWithEqualityFn创建，支持自定义比较函数
 * 使用subscribeWithSelector中间件优化性能
 * 使用shallow比较函数进行浅比较，避免不必要的重渲染
 * 集成开发工具用于调试，设置store名称为'LobeChat_Session'
 */
export const useSessionStore = createWithEqualityFn<SessionStore>()(
  subscribeWithSelector(
    devtools(createStore, {
      name: 'LobeChat_Session',
    }),
  ),
  shallow,
);

/**
 * 获取会话Store的当前状态
 * 用于在非React组件中访问store状态
 * @returns 当前会话store的完整状态
 */
export const getSessionStoreState = () => useSessionStore.getState();
