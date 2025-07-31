import type { StateCreator } from 'zustand/vanilla';
import UserAPI from '@/services/user';

import { UserItem } from '@/services/user';
import type { GlobalStore } from '../../store';

/**
 * 全局用户操作接口
 * 定义了用户相关的操作方法
 */
export interface UserAction {
  /**
   * 设置当前用户信息
   * @param user 用户信息
   */
  setCurrentUser: (user: UserItem | null) => void;

  /**
   * 加载当前用户信息
   */
  loadCurrentUser: () => Promise<void>;

  /**
   * 设置虚拟密钥
   * @param key 虚拟密钥
   */
  setVirtualKey: (key: string | null) => void;

  /**
   * 加载虚拟密钥
   * @param userId 用户ID
   * @param roleId 角色ID
   */
  loadVirtualKey: (userId: string, roleId: string) => Promise<void>;

  /**
   * 设置用户相关错误
   * @param error 错误信息
   */
  setUserError: (error: Error | null) => void;

  /**
   * 清除用户状态
   */
  clearUserState: () => void;
}

/**
 * 创建全局用户操作slice的工厂函数
 * 返回包含所有用户操作的对象
 */
export const userSlice: StateCreator<GlobalStore, [], [], UserAction> = (
  set,
  get
) => ({
  setCurrentUser: (currentUser) => {
    set({ currentUser });

    // 同步角色信息到角色 store
    if (typeof window !== 'undefined' && currentUser?.roles?.[0]) {
      import('@/store/role').then(({ useRoleStore }) => {
        useRoleStore.getState().setCurrentRole(currentUser?.roles?.[0] || null);
      });
    }
  },

  loadCurrentUser: async () => {
    try {
      set({ userError: null });

      // 动态导入 API 服务
      const currentUser = await UserAPI.getCurrentUser();

      set({ currentUser, userInit: true });

      // 自动加载虚拟密钥
      if (currentUser.id && currentUser.roles?.[0]?.id) {
        await get().loadVirtualKey(currentUser.id, currentUser.roles[0].id);
      }
    } catch (error) {
      console.error('用户信息加载异常:', error);
      set({
        userError:
          error instanceof Error ? error : new Error('加载用户信息失败'),
        currentUser: null,
      });
    }
  },

  setVirtualKey: (virtualKey) => set({ virtualKey }),

  loadVirtualKey: async (userId: string, roleId: string) => {
    try {
      const virtualKeyResponse = await UserAPI.getVirtualKey(userId, roleId);

      set({ virtualKey: virtualKeyResponse?.keyVaults?.api_key || null });
    } catch (error) {
      console.error('获取虚拟key失败:', error);
      set({
        userError:
          error instanceof Error ? error : new Error('获取虚拟密钥失败'),
      });
    }
  },

  setUserError: (userError) => set({ userError }),

  clearUserState: () => {
    set({
      currentUser: null,
      userInit: false,
      virtualKey: null,
      userError: null,
    });
  },
});
