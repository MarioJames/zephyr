import { ThemeMode } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { gt, parse, valid } from 'semver';
import { SWRResponse } from 'swr';
import type { StateCreator } from 'zustand/vanilla';

import { LOBE_THEME_APPEARANCE } from '@/const/base';
import { CURRENT_VERSION } from '@/const/version';
import { useOnlyFetchOnceSWR } from '@/libs/swr';
import { globalApi } from '@/app/api/global';
import type { SystemStatus } from '@/store/global/initialState';
import { LocaleMode } from '@/types/locale';
import { setCookie } from '@/utils/client/cookie';
import { switchLang } from '@/utils/client/switchLang';
import { merge } from '@/utils/merge';
import { setNamespace } from '@/utils/storeDebug';

import type { GlobalStore } from '../store';

const n = setNamespace('g');

/**
 * 全局通用操作接口
 * 定义了全局通用的操作方法
 */
export interface GlobalGeneralAction {
  /**
   * 切换语言
   * @param locale 目标语言模式
   */
  switchLocale: (locale: LocaleMode) => void;
  
  /**
   * 切换主题模式
   * @param themeMode 目标主题模式
   * @param params 可选参数
   * @param params.skipBroadcast 是否跳过广播
   */
  switchThemeMode: (themeMode: ThemeMode, params?: { skipBroadcast?: boolean }) => void;
  
  /**
   * 更新系统状态
   * @param status 要更新的状态部分
   * @param action 操作名称（用于调试）
   */
  updateSystemStatus: (status: Partial<SystemStatus>, action?: any) => void;
  
  /**
   * 检查最新版本Hook
   * @param enabledCheck 是否启用检查
   * @returns SWR响应对象
   */
  useCheckLatestVersion: (enabledCheck?: boolean) => SWRResponse<string>;
  
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
   * 切换语言
   * 更新系统状态中的语言设置并执行语言切换
   */
  switchLocale: (locale) => {
    // 更新系统状态中的语言设置
    get().updateSystemStatus({ language: locale });
    // 执行语言切换
    switchLang(locale);
  },
  
  /**
   * 切换主题模式
   * 更新系统状态中的主题设置并保存到Cookie
   */
  switchThemeMode: (themeMode, { skipBroadcast } = {}) => {
    // 更新系统状态中的主题模式
    get().updateSystemStatus({ themeMode });
    // 保存主题设置到Cookie，自动模式时不保存
    setCookie(LOBE_THEME_APPEARANCE, themeMode === 'auto' ? undefined : themeMode);
  },
  
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
    set({ status: nextStatus }, false, action || n('updateSystemStatus'));
    // 保存到本地存储
    get().statusStorage.saveToLocalStorage(nextStatus);
  },

  /**
   * 检查最新版本Hook
   * 使用SWR检查是否有新版本可用
   */
  useCheckLatestVersion: (enabledCheck = true) =>
    useOnlyFetchOnceSWR(
      enabledCheck ? 'checkLatestVersion' : null, // 只在启用检查时执行
      async () => globalApi.getLatestVersion(), // 获取最新版本
      {
        focusThrottleInterval: 1000 * 60 * 30, // 30分钟节流间隔
        onSuccess: (data: string) => {
          // 验证版本号格式
          if (!valid(CURRENT_VERSION) || !valid(data)) return;

          // 解析版本号
          const currentVersion = parse(CURRENT_VERSION);
          const latestVersion = parse(data);

          if (!currentVersion || !latestVersion) return;

          // 比较主版本号和次版本号
          const currentMajorMinor = `${currentVersion.major}.${currentVersion.minor}.0`;
          const latestMajorMinor = `${latestVersion.major}.${latestVersion.minor}.0`;

          // 如果有新版本，更新状态
          if (gt(latestMajorMinor, currentMajorMinor)) {
            set({ hasNewVersion: true, latestVersion: data }, false, n('checkLatestVersion'));
          }
        },
      },
    ),

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
