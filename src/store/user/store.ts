import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type UserState, initialState } from './initialState';
import { type UserAuthAction, createAuthSlice } from './slices/auth/action';
import { type CommonAction, createCommonSlice } from './slices/common/action';
import { type ModelListAction, createModelListSlice } from './slices/modelList/action';
import { type PreferenceAction, createPreferenceSlice } from './slices/preference/action';
import { type UserSettingsAction, createSettingsSlice } from './slices/settings/action';
import { type SyncAction, createSyncSlice } from './slices/sync/action';

//  ===============  聚合 createStoreFn ============ //

/**
 * 用户Store的完整类型定义
 * 通过交叉类型(&)将所有状态和操作组合在一起
 * 包含以下模块：
 * - SyncAction: 数据同步相关操作
 * - UserState: 用户状态数据
 * - UserSettingsAction: 用户设置相关操作
 * - PreferenceAction: 偏好设置相关操作
 * - ModelListAction: 模型列表相关操作
 * - UserAuthAction: 用户认证相关操作
 * - CommonAction: 通用操作
 */
export type UserStore = SyncAction &
  UserState &
  UserSettingsAction &
  PreferenceAction &
  ModelListAction &
  UserAuthAction &
  CommonAction;

/**
 * 创建用户Store的工厂函数
 * 将所有slice的状态和操作合并成一个完整的store
 * @param parameters - Zustand的创建参数
 * @returns 完整的用户store对象
 */
const createStore: StateCreator<UserStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createSyncSlice(...parameters),
  ...createSettingsSlice(...parameters),
  ...createPreferenceSlice(...parameters),
  ...createAuthSlice(...parameters),
  ...createCommonSlice(...parameters),
  ...createModelListSlice(...parameters),
});

//  ===============  实装 useStore ============ //

// 创建开发工具中间件实例，用于调试用户store
const devtools = createDevtools('user');

/**
 * 用户Store的React Hook
 * 使用createWithEqualityFn创建，支持自定义比较函数
 * 使用subscribeWithSelector中间件优化性能
 * 使用shallow比较函数进行浅比较，避免不必要的重渲染
 * 集成开发工具用于调试
 */
export const useUserStore = createWithEqualityFn<UserStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);

/**
 * 获取用户Store的当前状态
 * 用于在非React组件中访问store状态
 * @returns 当前用户store的完整状态
 */
export const getUserStoreState = () => useUserStore.getState();
