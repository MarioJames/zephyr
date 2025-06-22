/**
 * 会话Store模块的主入口文件
 * 重新导出store中的核心类型和Hook，提供统一的访问接口
 * 其他模块可以通过这个文件访问会话store的主要功能
 */

// 导出会话Store的类型定义
export type { SessionStore } from './store';

// 导出会话Store的Hook和状态获取函数
export { getSessionStoreState, useSessionStore } from './store';
