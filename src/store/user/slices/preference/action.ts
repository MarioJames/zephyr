import type { StateCreator } from 'zustand/vanilla';

import { userApi } from '@/app/api/user';
import type { UserStore } from '@/store/user';
import { UserGuide, UserPreference } from '@/types/user';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

const n = setNamespace('preference');

/**
 * 偏好设置操作接口
 * 定义了用户偏好相关的操作方法
 */
export interface PreferenceAction {
  /**
   * 更新引导状态
   * @param guide 要更新的引导配置
   */
  updateGuideState: (guide: Partial<UserGuide>) => Promise<void>;
  
  /**
   * 更新用户偏好设置
   * @param preference 要更新的偏好配置
   * @param action 操作名称（用于调试）
   */
  updatePreference: (preference: Partial<UserPreference>, action?: any) => Promise<void>;
}

/**
 * 创建偏好设置操作slice的工厂函数
 * 返回包含所有偏好设置相关操作的对象
 */
export const createPreferenceSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  PreferenceAction
> = (set, get) => ({
  /**
   * 更新引导状态
   * 合并当前引导状态和新设置，然后更新偏好设置
   */
  updateGuideState: async (guide) => {
    const { updatePreference } = get();
    // 合并当前引导状态和新设置
    const nextGuide = merge(get().preference.guide, guide);
    // 更新偏好设置
    await updatePreference({ guide: nextGuide });
  },

  /**
   * 更新用户偏好设置
   * 合并当前偏好设置和新设置，更新本地状态并同步到服务器
   */
  updatePreference: async (preference, action) => {
    // 合并当前偏好设置和新设置
    const nextPreference = merge(get().preference, preference);

    // 更新本地状态
    set({ preference: nextPreference }, false, action || n('updatePreference'));

    // 同步到服务器
    await userApi.updatePreference(nextPreference);
  },
});
