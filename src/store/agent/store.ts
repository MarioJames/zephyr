import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { AgentStoreState, initialState } from './initialState';
import { AgentChatAction, createChatSlice } from './slices/chat/action';

//  ===============  aggregate createStoreFn ============ //

/**
 * 代理Store的完整类型定义
 * 通过交叉类型(&)将所有状态和操作组合在一起
 * 包含以下模块：
 * - AgentChatAction: 代理聊天相关操作
 * - AgentStoreState: 代理状态数据
 */
export interface AgentStore extends AgentChatAction, AgentStoreState {}

/**
 * 创建代理Store的工厂函数
 * 将所有slice的状态和操作合并成一个完整的store
 * @param parameters - Zustand的创建参数
 * @returns 完整的代理store对象
 */
const createStore: StateCreator<AgentStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createChatSlice(...parameters),
});

//  ===============  implement useStore ============ //

// 创建开发工具中间件实例，用于调试代理store
const devtools = createDevtools('agent');

/**
 * 代理Store的React Hook
 * 使用createWithEqualityFn创建，支持自定义比较函数
 * 使用shallow比较函数进行浅比较，避免不必要的重渲染
 * 集成开发工具用于调试
 */
export const useAgentStore = createWithEqualityFn<AgentStore>()(devtools(createStore), shallow);

/**
 * 获取代理Store的当前状态
 * 用于在非React组件中访问store状态
 * @returns 当前代理store的完整状态
 */
export const getAgentStoreState = () => useAgentStore.getState();
