import { DEFAULT_PREFERENCE } from '@/const/base';
import { UserPreference } from '@/types/user';

/**
 * 用户偏好状态接口
 * 定义了用户偏好相关的状态字段
 */
export interface UserPreferenceState {
  /**
   * 用户偏好设置
   * 仅存储在本地存储中的用户偏好配置
   * 包含用户的各种个性化设置选项
   */
  preference: UserPreference;
}

/**
 * 用户偏好状态的初始值
 * 设置所有偏好相关字段的默认值
 */
export const initialPreferenceState: UserPreferenceState = {
  preference: DEFAULT_PREFERENCE,
};
