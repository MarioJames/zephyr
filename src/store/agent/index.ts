/**
 * 代理Store模块的主入口文件
 * 重新导出store中的核心类型和Hook，提供统一的访问接口
 * 其他模块可以通过这个文件访问代理store的主要功能
 */

// 导出代理Store的完整类型定义
export type { AgentStore } from './store';

// 导出代理Store的Hook和状态获取函数
export { getAgentStoreState, useAgentStore } from './store';
