import { DeepPartial } from 'utility-types';

import { DEFAULT_SETTINGS } from '@/const/settings';
import { UserSettings } from '@/types/user/settings';

/**
 * 用户设置状态接口
 * 定义了用户设置相关的所有状态字段
 */
export interface UserSettingsState {
  /**
   * 默认设置对象
   * 包含所有设置的默认值，作为设置的基准
   */
  defaultSettings: UserSettings;
  
  /**
   * 当前用户设置
   * 使用DeepPartial类型，允许部分更新设置
   * 只包含用户实际修改过的设置项
   */
  settings: DeepPartial<UserSettings>;
  
  /**
   * 设置更新信号控制器
   * 用于取消正在进行的设置更新操作
   * 当用户快速连续修改设置时，可以取消之前的更新请求
   */
  updateSettingsSignal?: AbortController;
}

/**
 * 设置状态的初始值
 * 设置默认设置和空的用户设置对象
 */
export const initialSettingsState: UserSettingsState = {
  defaultSettings: DEFAULT_SETTINGS,
  settings: {},
};
