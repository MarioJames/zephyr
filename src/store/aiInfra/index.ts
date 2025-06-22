/**
 * AI基础设施Store模块的主入口文件
 * 重新导出store中的核心选择器、Hook和状态获取函数，提供统一的访问接口
 * 其他模块可以通过这个文件访问AI基础设施store的主要功能
 */

// 导出所有选择器
export * from './selectors';
// 导出AI基础设施Store的Hook和状态获取函数
export { getAiInfraStoreState, useAiInfraStore } from './store';
