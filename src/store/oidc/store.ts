import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { createDevtools } from '../middleware/createDevtools';
import { type OIDCState, initialState } from './initialState';
import { type OIDCAuthAction, createOIDCAuthSlice } from './slices/auth/action';
import { type OIDCTokenAction, createOIDCTokenSlice } from './slices/token/action';
import { type OIDCUserAction, createOIDCUserSlice } from './slices/user/action';

//  ===============  聚合 createStoreFn ============ //

/**
 * OIDC Store的完整类型定义
 * 通过交叉类型(&)将所有状态和操作组合在一起
 */
export type OIDCStore = OIDCState & 
  OIDCAuthAction & 
  OIDCTokenAction & 
  OIDCUserAction;

/**
 * 创建OIDC Store的工厂函数
 */
const createStore: StateCreator<OIDCStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...createOIDCAuthSlice(...parameters),
  ...createOIDCTokenSlice(...parameters),
  ...createOIDCUserSlice(...parameters),
});

//  ===============  实装 useStore ============ //

// 创建开发工具中间件实例
const devtools = createDevtools('oidc');

/**
 * OIDC Store的React Hook
 * 集成了持久化、开发工具、浅比较等中间件
 */
export const useOIDCStore = createWithEqualityFn<OIDCStore>()(
  subscribeWithSelector(
    persist(
      devtools(createStore),
      {
        name: 'oidc-storage', // localStorage key
        storage: createJSONStorage(() => localStorage),
        // 只持久化必要的状态，不持久化 loading、error、timer 等临时状态
        partialize: (state) => ({
          user: state.user,
          userInfo: state.userInfo,
          tokenInfo: state.tokenInfo,
          isAuthenticated: state.isAuthenticated,
          lastRefreshTime: state.lastRefreshTime,
        }),
        // 从持久化存储恢复后的处理
        onRehydrateStorage: () => (state) => {
          if (state?.isAuthenticated && state?.tokenInfo) {
            // 恢复后重新设置自动刷新定时器
            state.scheduleTokenRefresh();
          }
        },
      }
    )
  ),
  shallow,
);

/**
 * 获取OIDC Store的当前状态
 * 用于在非React组件中访问store状态
 */
export const getOIDCStoreState = () => useOIDCStore.getState();