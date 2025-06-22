/**
 * 聊天Store模块的主入口文件
 * 重新导出store中的核心类型和Hook，提供统一的访问接口
 * 其他模块可以通过这个文件访问聊天store的主要功能
 */

// 导出聊天Store状态类型
export type { ChatStoreState } from './initialState';

// 导出聊天Store的完整类型定义
export type { ChatStore } from './store';

// 导出聊天Store的Hook和状态获取函数
export { getChatStoreState, useChatStore } from './store';
