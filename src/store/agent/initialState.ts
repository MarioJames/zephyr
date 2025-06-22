// 导入代理聊天相关的状态类型和初始状态
import { AgentState, initialAgentChatState } from './slices/chat/initialState'; // 代理聊天状态

/**
 * 代理Store状态的完整类型定义
 * 目前只包含代理聊天状态，未来可能会扩展其他代理相关状态
 */
export type AgentStoreState = AgentState;

/**
 * 代理Store的初始状态
 * 通过展开操作符(...)将所有子模块的初始状态合并
 * 为整个代理store提供一个完整的初始状态对象
 */
export const initialState: AgentStoreState = {
  ...initialAgentChatState, // 代理聊天相关初始状态
};
