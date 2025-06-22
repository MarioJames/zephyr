// sort-imports-ignore
// 导入各个slice的状态类型和初始状态
import { ChatToolState, initialToolState } from './slices/builtinTool/initialState'; // 内置工具状态
import { ChatMessageState, initialMessageState } from './slices/message/initialState'; // 消息状态
import { ChatTopicState, initialTopicState } from './slices/topic/initialState'; // 话题状态
import { ChatAIChatState, initialAiChatState } from './slices/aiChat/initialState'; // AI聊天状态

/**
 * 聊天Store状态的完整类型定义
 * 通过交叉类型(&)将所有子模块的状态组合在一起
 * 包含以下状态模块：
 * - ChatTopicState: 话题相关状态
 * - ChatMessageState: 消息相关状态
 * - ChatAIChatState: AI聊天相关状态
 * - ChatToolState: 内置工具相关状态
 */
export type ChatStoreState = ChatTopicState &
  ChatMessageState &
  ChatAIChatState &
  ChatToolState;

/**
 * 聊天Store的初始状态
 * 通过展开操作符(...)将所有子模块的初始状态合并
 * 为整个聊天store提供一个完整的初始状态对象
 */
export const initialState: ChatStoreState = {
  ...initialMessageState, // 消息相关初始状态
  ...initialAiChatState, // AI聊天相关初始状态
  ...initialTopicState, // 话题相关初始状态
  ...initialToolState, // 内置工具相关初始状态
};
