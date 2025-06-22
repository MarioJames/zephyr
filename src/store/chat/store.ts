// sort-imports-ignore
// 导入Zustand相关工具函数
import { subscribeWithSelector } from 'zustand/middleware'; // 订阅选择器中间件，用于优化组件重渲染
import { shallow } from 'zustand/shallow'; // 浅比较函数，用于比较状态变化
import { createWithEqualityFn } from 'zustand/traditional'; // 创建store的传统方式，支持自定义比较函数
import { StateCreator } from 'zustand/vanilla'; // Zustand的核心类型定义

// 导入自定义中间件和类型
import { createDevtools } from '../middleware/createDevtools'; // 开发工具中间件，用于调试
import { ChatStoreState, initialState } from './initialState'; // 聊天状态类型和初始状态

// 导入各个slice的操作
import { ChatBuiltinToolAction, chatToolSlice } from './slices/builtinTool/actions'; // 内置工具相关操作
import { ChatTranslateAction, chatTranslate } from './slices/translate/action'; // 翻译相关操作
import { ChatMessageAction, chatMessage } from './slices/message/action'; // 消息相关操作
import { ChatTopicAction, chatTopic } from './slices/topic/action'; // 话题相关操作
import { ChatAIChatAction, chatAiChat } from './slices/aiChat/actions'; // AI聊天相关操作

/**
 * 聊天Store操作接口
 * 通过交叉类型(&)将所有操作组合在一起
 * 包含以下操作模块：
 * - ChatMessageAction: 消息相关操作
 * - ChatAIChatAction: AI聊天相关操作
 * - ChatTopicAction: 话题相关操作
 * - ChatTranslateAction: 翻译相关操作
 * - ChatBuiltinToolAction: 内置工具相关操作
 */
export interface ChatStoreAction
  extends ChatMessageAction,
    ChatAIChatAction,
    ChatTopicAction,
    ChatTranslateAction,
    ChatBuiltinToolAction {}

/**
 * 聊天Store的完整类型定义
 * 结合操作接口和状态接口
 */
export type ChatStore = ChatStoreAction & ChatStoreState;

//  ===============  聚合 createStoreFn ============ //

/**
 * 创建聊天Store的工厂函数
 * 将所有slice的状态和操作合并成一个完整的store
 * @param params - Zustand的创建参数
 * @returns 完整的聊天store对象
 */
const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (...params) => ({
  ...initialState, // 展开初始状态

  // 展开各个slice的操作
  ...chatMessage(...params), // 消息相关操作
  ...chatAiChat(...params), // AI聊天相关操作
  ...chatTopic(...params), // 话题相关操作
  ...chatTranslate(...params), // 翻译相关操作
  ...chatToolSlice(...params), // 内置工具相关操作

  // cloud - 预留云服务相关功能
});

//  ===============  实装 useStore ============ //

// 创建开发工具中间件实例，用于调试聊天store
const devtools = createDevtools('chat');

/**
 * 聊天Store的React Hook
 * 使用createWithEqualityFn创建，支持自定义比较函数
 * 使用subscribeWithSelector中间件优化性能
 * 使用shallow比较函数进行浅比较，避免不必要的重渲染
 * 集成开发工具用于调试
 */
export const useChatStore = createWithEqualityFn<ChatStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);

/**
 * 获取聊天Store的当前状态
 * 用于在非React组件中访问store状态
 * @returns 当前聊天store的完整状态
 */
export const getChatStoreState = () => useChatStore.getState();
