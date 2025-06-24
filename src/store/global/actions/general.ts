import isEqual from 'fast-deep-equal';
import { SWRResponse } from 'swr';
import type { StateCreator } from 'zustand/vanilla';

import { useOnlyFetchOnceSWR } from '@/libs/swr';
import type { SystemStatus } from '@/store/global/initialState';
import { merge } from '@/utils/merge';

import type { GlobalStore } from '../store';


/**
 * 全局通用操作接口
 * 定义了全局通用的操作方法
 */
export interface GlobalGeneralAction {
  /**
   * 更新系统状态
   * @param status 要更新的状态部分
   * @param action 操作名称（用于调试）
   */
  updateSystemStatus: (status: Partial<SystemStatus>, action?: any) => void;
  
  /**
   * 初始化系统状态Hook
   * @returns SWR响应对象
   */
  useInitSystemStatus: () => SWRResponse;
}

/**
 * 创建全局通用操作slice的工厂函数
 * 返回包含所有全局通用操作的对象
 */
export const generalActionSlice: StateCreator<
  GlobalStore,
  [['zustand/devtools', never]],
  [],
  GlobalGeneralAction
> = (set, get) => ({
  /**
   * 更新系统状态
   * 合并状态并保存到本地存储
   */
  updateSystemStatus: (status, action) => {
    // 如果状态未初始化，直接返回
    if (!get().isStatusInit) return;

    // 合并当前状态和新状态
    const nextStatus = merge(get().status, status);

    // 如果状态没有变化，直接返回
    if (isEqual(get().status, nextStatus)) return;

    // 更新状态
    set({ status: nextStatus }, false);
    // 保存到本地存储
    get().statusStorage.saveToLocalStorage(nextStatus);
  },
  /**
   * 初始化系统状态Hook
   * 从本地存储加载系统状态
   */
  useInitSystemStatus: () =>
    useOnlyFetchOnceSWR<SystemStatus>(
      'initSystemStatus',
      () => get().statusStorage.getFromLocalStorage(), // 从本地存储获取状态
      {
        onSuccess: (status) => {
          // 标记状态已初始化
          set({ isStatusInit: true }, false, 'setStatusInit');
          // 更新系统状态
          get().updateSystemStatus(status, 'initSystemStatus');
        },
      },
    ),
});
