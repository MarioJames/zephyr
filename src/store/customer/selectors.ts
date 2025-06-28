import { coreSelectors } from './slices/core/selectors';
import { categorySelectors } from './slices/category/selectors';

// ========== 导出所有选择器 ==========
export const customerSelectors = {
  // 核心功能选择器
  ...coreSelectors,

  // 分类功能选择器
  ...categorySelectors,
};
