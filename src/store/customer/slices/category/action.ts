import { StateCreator } from 'zustand/vanilla';
import agentsAPI, { AgentItem } from '@/services/agents';
import { CustomerState } from '../../initialState';

// ========== 分类功能Action接口 ==========
export interface CategoryAction {
  setSelectedCategory: (categoryId: string) => void;
  updateCategoryStats: () => void;
  fetchAgents: () => Promise<void>;
  setAgents: (agents: AgentItem[]) => void;
  clearCategoryData: () => void;
}

// ========== 分类功能Slice ==========
export const categorySlice: StateCreator<
  CustomerState & CategoryAction,
  [],
  [],
  CategoryAction
> = (set, get) => ({
  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId, currentPage: 1 });

    // 触发搜索slice的过滤方法
    const state = get() as any;
    if (state.filterCustomers) {
      state.filterCustomers();
    }
  },

  updateCategoryStats: () => {
    const { customers, agents } = get();

    const categoryStats: Record<string, number> = {};

    // 初始化所有Agent类别为0
    agents.forEach(agent => {
      categoryStats[agent.id] = 0;
    });

    // 统计未分类客户
    categoryStats['unclassified'] = 0;

    // 遍历客户进行分类统计
    customers.forEach(customer => {
      const agentId = customer.session.agentId;
      if (agentId && categoryStats.hasOwnProperty(agentId)) {
        categoryStats[agentId]++;
      } else {
        categoryStats['unclassified']++;
      }
    });

    set({ categoryStats });
  },

  fetchAgents: async () => {
    try {
      const agents = await agentsAPI.getAgentList();
      set({ agents });

      // 更新分类统计
      get().updateCategoryStats();
    } catch (error) {
      console.error('获取Agent列表失败:', error);
    }
  },

  setAgents: (agents) => {
    set({ agents });
    get().updateCategoryStats();
  },

  clearCategoryData: () => {
    set({
      selectedCategory: 'all',
      categoryStats: {},
      agents: [],
    });
  },
});
