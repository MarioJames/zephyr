import useSWR, { SWRResponse } from 'swr';
import type { StateCreator } from 'zustand/vanilla';

import type { UserStore } from '@/store/user';
import { OnSyncEvent, PeerSyncStatus } from '@/types/sync';
import { browserInfo } from '@/utils/platform';
import { setNamespace } from '@/utils/storeDebug';

import { userProfileSelectors } from '../auth/selectors';
import { syncSettingsSelectors } from './selectors';

const n = setNamespace('sync');

/**
 * 同步操作接口
 * 定义了用户数据同步相关的操作方法
 */
export interface SyncAction {
  /**
   * 刷新连接
   * 重新建立同步连接
   * @param onEvent 同步事件回调
   */
  refreshConnection: (onEvent: OnSyncEvent) => Promise<void>;
  
  /**
   * 触发启用同步
   * @param userId 用户ID
   * @param onEvent 同步事件回调
   * @returns 是否成功启用同步
   */
  triggerEnableSync: (userId: string, onEvent: OnSyncEvent) => Promise<boolean>;
  
  /**
   * 启用同步Hook
   * @param systemEnable 系统是否启用同步
   * @param params 同步参数
   * @param params.onEvent 同步事件回调
   * @param params.userEnableSync 用户是否启用同步
   * @param params.userId 用户ID
   * @returns SWR响应对象
   */
  useEnabledSync: (
    systemEnable: boolean | undefined,
    params: {
      onEvent: OnSyncEvent;
      userEnableSync: boolean;
      userId: string | undefined;
    },
  ) => SWRResponse;
}

/**
 * 创建同步操作slice的工厂函数
 * 返回包含所有同步相关操作的对象
 */
export const createSyncSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  SyncAction
> = (set, get) => ({
  /**
   * 刷新连接
   * 获取用户ID并重新触发同步连接
   */
  refreshConnection: async (onEvent) => {
    const userId = userProfileSelectors.userId(get());

    // 如果没有用户ID，直接返回
    if (!userId) return;

    // 重新触发同步连接
    await get().triggerEnableSync(userId, onEvent);
  },

  /**
   * 触发启用同步
   * 检查同步配置并建立同步连接
   */
  triggerEnableSync: async (userId: string, onEvent: OnSyncEvent) => {
    // 双重检查同步能力
    // 如果没有频道名称，不启动同步
    const sync = syncSettingsSelectors.webrtcConfig(get());
    if (!sync.channelName || !sync.signaling) return false;

    // 获取设备名称
    const name = syncSettingsSelectors.deviceName(get());

    // 默认用户名格式
    const defaultUserName = `My ${browserInfo.browser} (${browserInfo.os})`;

    // 设置连接中状态
    set({ syncStatus: PeerSyncStatus.Connecting });
    
    // 动态导入同步API
    const { syncApi } = await import('@/app/api');

    // 启用同步连接
    return syncApi.enabledSync({
      channel: {
        name: sync.channelName, // 频道名称
        password: sync.channelPassword, // 频道密码
      },
      // 感知状态变化回调
      onAwarenessChange(state) {
        set({ syncAwareness: state });
      },
      // 同步事件回调
      onSyncEvent: onEvent,
      // 同步状态变化回调
      onSyncStatusChange: (status) => {
        set({ syncStatus: status });
      },
      signaling: sync.signaling, // 信令服务器
      user: {
        id: userId, // 用户ID
        // 如果用户没有设置名称，使用默认名称
        name: name || defaultUserName,
        ...browserInfo, // 浏览器信息
      },
    });
  },

  /**
   * 启用同步Hook
   * 根据系统设置和用户偏好管理同步状态
   */
  useEnabledSync: (systemEnable, { userEnableSync, userId, onEvent }) =>
    useSWR<boolean>(
      systemEnable ? ['enableSync', userEnableSync, userId] : null, // 只在系统启用时获取
      async () => {
        // 如果没有用户ID，不启动同步
        if (!userId) return false;

        // 如果用户没有启用同步，停止同步
        if (!userEnableSync) {
          const { syncApi } = await import('@/app/api');
          return syncApi.disableSync();
        }

        // 否则触发启用同步
        return get().triggerEnableSync(userId, onEvent);
      },
      {
        onSuccess: (syncEnabled) => {
          // 更新同步启用状态
          set({ syncEnabled }, false, n('useEnabledSync'));
        },
        revalidateOnFocus: false, // 聚焦时不重新验证
      },
    ),
});
