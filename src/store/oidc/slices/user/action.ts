import { StateCreator } from 'zustand/vanilla';

import API, { UserItem } from '@/services/user';
import { OIDCStore } from '../../store';

/**
 * OIDC用户信息管理操作接口
 */
export interface OIDCUserAction {
  /**
   * 设置用户信息
   */
  setUserInfo: (userInfo: UserItem | null) => void;

  /**
   * 设置用户信息加载状态
   */
  setLoadingUserInfo: (loading: boolean) => void;

  /**
   * 加载用户信息
   */
  loadUserInfo: () => Promise<void>;
}

/**
 * 创建OIDC用户信息管理slice
 */
export const createOIDCUserSlice: StateCreator<
  OIDCStore,
  [],
  [],
  OIDCUserAction
> = (set, get) => ({
  setUserInfo: (userInfo) => set({ userInfo }),

  setLoadingUserInfo: (isLoadingUserInfo) => set({ isLoadingUserInfo }),

  loadUserInfo: async () => {
    const { user } = get();

    if (!user) {
      console.warn('用户未认证，跳过用户信息加载');
      return;
    }

    try {
      set({ isLoadingUserInfo: true, error: null });

      const userInfo = await API.getCurrentUser();
      set({ userInfo });
    } catch (error) {
      console.error('用户信息加载异常:', error);
      set({
        error: error instanceof Error ? error : new Error('加载用户信息失败'),
        userInfo: null,
      });
    } finally {
      set({ isLoadingUserInfo: false });
    }
  },
});
