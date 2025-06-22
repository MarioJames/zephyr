import isEqual from 'fast-deep-equal';
import { DeepPartial } from 'utility-types';
import type { StateCreator } from 'zustand/vanilla';

import { MESSAGE_CANCEL_FLAT } from '@/const/message';
import { userApi } from '@/app/api/user';
import type { UserStore } from '@/store/user';
import { LobeAgentSettings } from '@/types/session';
import {
  SystemAgentItem,
  UserGeneralConfig,
  UserKeyVaults,
  UserSettings,
  UserSystemAgentConfigKey,
} from '@/types/user/settings';
import { difference } from '@/utils/difference';
import { merge } from '@/utils/merge';

/**
 * 用户设置操作接口
 * 定义了用户设置相关的所有操作方法
 */
export interface UserSettingsAction {
  /**
   * 导入应用设置
   * 将外部设置导入到当前用户设置中
   * @param settings 要导入的设置对象
   */
  importAppSettings: (settings: UserSettings) => Promise<void>;
  
  /**
   * 内部创建信号控制器
   * 用于取消正在进行的设置更新操作
   * @returns 新的AbortController实例
   */
  internal_createSignal: () => AbortController;
  
  /**
   * 重置设置
   * 将用户设置重置为默认值
   */
  resetSettings: () => Promise<void>;
  
  /**
   * 设置用户设置
   * 更新用户设置并同步到服务器
   * @param settings 要更新的设置对象
   */
  setSettings: (settings: DeepPartial<UserSettings>) => Promise<void>;
  
  /**
   * 更新默认代理设置
   * @param agent 代理设置对象
   */
  updateDefaultAgent: (agent: DeepPartial<LobeAgentSettings>) => Promise<void>;
  
  /**
   * 更新通用配置
   * @param settings 通用配置对象
   */
  updateGeneralConfig: (settings: Partial<UserGeneralConfig>) => Promise<void>;
  
  /**
   * 更新密钥库设置
   * @param settings 密钥库设置对象
   */
  updateKeyVaults: (settings: Partial<UserKeyVaults>) => Promise<void>;

  /**
   * 更新系统代理设置
   * @param key 系统代理配置键
   * @param value 系统代理配置值
   */
  updateSystemAgent: (
    key: UserSystemAgentConfigKey,
    value: Partial<SystemAgentItem>,
  ) => Promise<void>;
}

/**
 * 创建设置操作slice的工厂函数
 * 返回包含所有设置相关操作的对象
 */
export const createSettingsSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  UserSettingsAction
> = (set, get) => ({
  /**
   * 导入应用设置
   * 直接调用setSettings方法导入设置
   */
  importAppSettings: async (importAppSettings) => {
    const { setSettings } = get();
    await setSettings(importAppSettings);
  },

  /**
   * 内部创建信号控制器
   * 取消之前的更新操作并创建新的信号控制器
   */
  internal_createSignal: () => {
    // 获取当前的信号控制器
    const abortController = get().updateSettingsSignal;
    // 如果存在且未中止，则中止之前的操作
    if (abortController && !abortController.signal.aborted)
      abortController.abort(MESSAGE_CANCEL_FLAT);

    // 创建新的信号控制器
    const newSignal = new AbortController();
    // 更新状态中的信号控制器
    set({ updateSettingsSignal: newSignal }, false, 'signalForUpdateSettings');

    return newSignal;
  },

  /**
   * 重置设置
   * 调用API重置用户设置并刷新用户状态
   */
  resetSettings: async () => {
    await userApi.resetUserSettings(); // 重置用户设置
    await get().refreshUserState(); // 刷新用户状态
  },
  
  /**
   * 设置用户设置
   * 合并设置、计算差异、乐观更新并同步到服务器
   */
  setSettings: async (settings) => {
    const { settings: prevSetting, defaultSettings } = get();

    // 合并当前设置和新设置
    const nextSettings = merge(prevSetting, settings);

    // 如果设置没有变化，直接返回
    if (isEqual(prevSetting, nextSettings)) return;

    // 计算与默认设置的差异
    const diffs = difference(nextSettings, defaultSettings);
    // 乐观更新：立即更新本地状态
    set({ settings: diffs }, false, 'optimistic_updateSettings');

    // 创建信号控制器并同步到服务器
    const abortController = get().internal_createSignal();
    await userApi.updateUserSettings(diffs, abortController.signal);
    await get().refreshUserState(); // 刷新用户状态
  },
  
  /**
   * 更新默认代理设置
   * 调用setSettings更新默认代理
   */
  updateDefaultAgent: async (defaultAgent) => {
    await get().setSettings({ defaultAgent });
  },
  
  /**
   * 更新通用配置
   * 调用setSettings更新通用配置
   */
  updateGeneralConfig: async (general) => {
    await get().setSettings({ general });
  },
  
  /**
   * 更新密钥库设置
   * 调用setSettings更新密钥库设置
   */
  updateKeyVaults: async (keyVaults) => {
    await get().setSettings({ keyVaults });
  },
  
  /**
   * 更新系统代理设置
   * 调用setSettings更新指定键的系统代理设置
   */
  updateSystemAgent: async (key, value) => {
    await get().setSettings({
      systemAgent: { [key]: { ...value } },
    });
  },
});
