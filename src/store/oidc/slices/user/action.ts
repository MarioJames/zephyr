import { StateCreator } from 'zustand/vanilla';

import API, { UserItem } from '@/services/user';
import { useRoleStore } from '@/store/role';
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
  setUserInfo: (userInfo) => {
    set({ userInfo });

    useRoleStore.getState().setCurrentRole(userInfo?.roles?.[0] || null);
  },

  setLoadingUserInfo: (isLoadingUserInfo) => set({ isLoadingUserInfo }),

  loadUserInfo: async () => {
    const { user, isLoadingUserInfo } = get();

    // 如果已经在加载中，跳过
    if (isLoadingUserInfo) {
      console.log('用户信息正在加载中，跳过重复加载');
      return;
    }

    if (!user) {
      console.warn('用户未认证，跳过用户信息加载');
      return;
    }

    try {
      set({ isLoadingUserInfo: true, error: null });

      const userInfo = await API.getCurrentUser();
      // 获取虚拟key
      if (userInfo.id && userInfo.roles?.[0]?.id) {
        try {
          const virtualKeyResponse = await API.getVirtualKey(userInfo.id, userInfo.roles[0].id);
          console.log("virtualKeyResponse",virtualKeyResponse);
          set({ virtualKey: virtualKeyResponse.key });
        } catch (error) {
          console.error('获取虚拟key失败:', error);
        }
      }

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
