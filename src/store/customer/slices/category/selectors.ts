import { CustomerState } from '../../initialState';

// ========== 分类功能选择器 ==========
export const categorySelectors = {
  // 获取当前选中的类别
  selectedCategory: (state: CustomerState) => state.selectedCategory,

  // 获取分类统计数据
  categoryStats: (state: CustomerState) => state.categoryStats,
};
