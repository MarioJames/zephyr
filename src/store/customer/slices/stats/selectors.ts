import { CustomerState } from '../../initialState';

// ========== 统计功能选择器 ==========
export const statsSelectors = {
  // 获取客户统计数据
  customerStats: (state: CustomerState) => state.customerStats,

  // 获取统计加载状态
  statsLoading: (state: CustomerState) => state.statsLoading,

  // 获取客户总数
  totalCustomers: (state: CustomerState) => state.customerStats.total,

  // 获取分类统计数据
  categoryStats: (state: CustomerState) => state.customerStats.byCategory,

  // 根据Agent ID获取客户数量
  getCustomerCountByCategory: (state: CustomerState) => (categoryId: string) =>
    state.customerStats.byCategory[categoryId] || 0,

  // 获取未分类客户数量
  unclassifiedCustomersCount: (state: CustomerState) =>
    state.customerStats.byCategory['unclassified'] || 0,

  // 获取统计数据最后更新时间
  statsLastUpdated: (state: CustomerState) => state.customerStats.lastUpdated,

  // 检查是否有统计数据
  hasStatsData: (state: CustomerState) =>
    state.customerStats.total > 0 || Object.keys(state.customerStats.byCategory).length > 0,

  // 获取最大的类别及其数量
  getLargestCategory: (state: CustomerState) => {
    const { byCategory } = state.customerStats;
    let maxCategory = '';
    let maxCount = 0;

    Object.entries(byCategory).forEach(([categoryId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxCategory = categoryId;
      }
    });

    return { categoryId: maxCategory, count: maxCount };
  },

  // 获取所有类别的总数（用于验证）
  getTotalFromCategories: (state: CustomerState) => {
    const { byCategory } = state.customerStats;
    return Object.values(byCategory).reduce((sum, count) => sum + count, 0);
  },
};
