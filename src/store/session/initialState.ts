// 导入各个slice的状态类型和初始状态
import { SessionState, initialSessionState } from './slices/session/initialState'; // 会话状态
import { SessionGroupState, initSessionGroupState } from './slices/sessionGroup/initialState'; // 会话分组状态

/**
 * 会话Store状态的完整类型定义
 * 通过交叉类型(&)将所有子模块的状态组合在一起
 * 包含以下状态模块：
 * - SessionGroupState: 会话分组相关状态
 * - SessionState: 会话相关状态
 */
export interface SessionStoreState extends SessionGroupState, SessionState {}

/**
 * 会话Store的初始状态
 * 通过展开操作符(...)将所有子模块的初始状态合并
 * 为整个会话store提供一个完整的初始状态对象
 */
export const initialState: SessionStoreState = {
  ...initSessionGroupState, // 会话分组相关初始状态
  ...initialSessionState, // 会话相关初始状态
};
