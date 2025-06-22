// 导入各个slice的状态类型和初始状态
import { UserAuthState, initialAuthState } from './slices/auth/initialState'; // 用户认证状态
import { CommonState, initialCommonState } from './slices/common/initialState'; // 通用状态
import { ModelListState, initialModelListState } from './slices/modelList/initialState'; // 模型列表状态
import { UserPreferenceState, initialPreferenceState } from './slices/preference/initialState'; // 用户偏好状态
import { UserSettingsState, initialSettingsState } from './slices/settings/initialState'; // 用户设置状态
import { UserSyncState, initialSyncState } from './slices/sync/initialState'; // 用户同步状态

/**
 * 用户状态的完整类型定义
 * 通过交叉类型(&)将所有子模块的状态组合在一起
 * 包含以下状态模块：
 * - UserSyncState: 数据同步相关状态
 * - UserSettingsState: 用户设置相关状态
 * - UserPreferenceState: 用户偏好相关状态
 * - UserAuthState: 用户认证相关状态
 * - ModelListState: 模型列表相关状态
 * - CommonState: 通用状态
 */
export type UserState = UserSyncState &
  UserSettingsState &
  UserPreferenceState &
  UserAuthState &
  ModelListState &
  CommonState;

/**
 * 用户Store的初始状态
 * 通过展开操作符(...)将所有子模块的初始状态合并
 * 为整个用户store提供一个完整的初始状态对象
 */
export const initialState: UserState = {
  ...initialSyncState, // 同步相关初始状态
  ...initialSettingsState, // 设置相关初始状态
  ...initialPreferenceState, // 偏好设置相关初始状态
  ...initialAuthState, // 认证相关初始状态
  ...initialCommonState, // 通用初始状态
  ...initialModelListState, // 模型列表相关初始状态
};
