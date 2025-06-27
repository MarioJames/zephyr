import { CustomerState } from '../../initialState';

// ========== 分类功能选择器 ==========
export const categorySelectors = {
  // 获取当前选中的类别
  selectedCategory: (state: CustomerState) => state.selectedCategory,

  // 获取分类统计数据
  categoryStats: (state: CustomerState) => state.categoryStats,

  // 获取Agent列表
  agents: (state: CustomerState) => state.agents,

  // 根据Agent ID获取Agent信息
  getAgentById: (state: CustomerState) => (agentId: string) =>
    state.agents.find(agent => agent.id === agentId),

  // 获取Agent名称
  getAgentTitle: (state: CustomerState) => (agentId: string) => {
    const agent = state.agents.find(agent => agent.id === agentId);
    return agent?.title || '未知类别';
  },

  // 根据类别ID获取客户数量
  getCategoryCount: (state: CustomerState) => (categoryId: string) =>
    state.categoryStats[categoryId] || 0,

  // 获取未分类客户数量
  getUnclassifiedCount: (state: CustomerState) =>
    state.categoryStats['unclassified'] || 0,

  // 检查是否选择了特定类别（非'all'）
  hasSelectedSpecificCategory: (state: CustomerState) =>
    state.selectedCategory !== 'all',

  // 获取所有可用的类别选项
  getCategoryOptions: (state: CustomerState) => {
    const options = [
      { id: 'all', title: '全部客户', count: state.customers.length }
    ];

    // 添加Agent类别
    state.agents.forEach(agent => {
      options.push({
        id: agent.id,
        title: agent.title || '未命名类别',
        count: state.categoryStats[agent.id] || 0
      });
    });

    // 添加未分类选项（如果有未分类客户）
    const unclassifiedCount = state.categoryStats['unclassified'] || 0;
    if (unclassifiedCount > 0) {
      options.push({
        id: 'unclassified',
        title: '未分类',
        count: unclassifiedCount
      });
    }

    return options;
  },

  // 获取当前选中类别的名称
  getCurrentCategoryTitle: (state: CustomerState) => {
    const { selectedCategory, agents } = state;

    if (selectedCategory === 'all') {
      return '全部客户';
    }

    if (selectedCategory === 'unclassified') {
      return '未分类';
    }

    const agent = agents.find(agent => agent.id === selectedCategory);
    return agent?.title || '未知类别';
  },

  // 检查是否有Agent数据
  hasAgents: (state: CustomerState) => state.agents.length > 0,

  // 获取最大的类别
  getLargestCategory: (state: CustomerState) => {
    const { categoryStats } = state;
    let maxCategoryId = '';
    let maxCount = 0;

    Object.entries(categoryStats).forEach(([categoryId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxCategoryId = categoryId;
      }
    });

    return { categoryId: maxCategoryId, count: maxCount };
  },
};
