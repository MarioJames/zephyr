import { coreSelectors } from './slices/core/selectors';
import { statsSelectors } from './slices/stats/selectors';
import { searchSelectors } from './slices/search/selectors';
import { categorySelectors } from './slices/category/selectors';

// ========== 导出所有选择器 ==========
export const customerSelectors = {
  // 核心功能选择器
  ...coreSelectors,

  // 统计功能选择器
  ...statsSelectors,

  // 搜索功能选择器
  ...searchSelectors,

  // 分类功能选择器
  ...categorySelectors,

  // 复合选择器
  getCustomerWithCategory: (state: any) => (sessionId: string) => {
    const customer = coreSelectors.getCustomerBySessionId(state)(sessionId);
    if (!customer) return null;

    const agentTitle = categorySelectors.getAgentTitle(state)(customer.session.agentId || '');

    return {
      ...customer,
      categoryTitle: agentTitle,
    };
  },

  getCustomerListWithCategories: (state: any) => {
    const customers = searchSelectors.displayCustomers(state);
    return customers.map(customer => {
      const agentTitle = categorySelectors.getAgentTitle(state)(customer.session.agentId || '');

      return {
        ...customer,
        categoryTitle: agentTitle,
      };
    });
  },

  // 获取完整的统计信息（包括分类）
  getFullStats: (state: any) => {
    const customerStats = statsSelectors.customerStats(state);
    const categoryOptions = categorySelectors.getCategoryOptions(state);

    return {
      ...customerStats,
      categories: categoryOptions,
    };
  },

  // 获取当前显示的客户列表（考虑分页）
  getCurrentPageCustomers: (state: any) => {
    return searchSelectors.paginatedCustomers(state);
  },
};
