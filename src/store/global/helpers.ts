import { useGlobalStore } from '@/store/global/index';
import { globalGeneralSelectors } from '@/store/global/selectors';

/**
 * 获取当前语言设置
 * 从全局store中获取当前应用的语言设置
 * @returns 当前语言模式
 */
const getCurrentLanguage = () => globalGeneralSelectors.currentLanguage(useGlobalStore.getState());

/**
 * 全局辅助函数集合
 * 提供全局相关的工具函数
 */
export const globalHelpers = { 
  getCurrentLanguage, // 获取当前语言
};
