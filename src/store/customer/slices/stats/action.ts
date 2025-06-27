import { StateCreator } from 'zustand/vanilla';
import { CustomerState } from '../../initialState';

// ========== 统计功能Action接口 ==========
export interface StatsAction {
  updateCustomerStats: () => void;
  fetchCustomerStats: () => Promise<void>;
  clearCustomerStats: () => void;
}

// ========== 统计功能Slice ==========
export const statsSlice: StateCreator<
  CustomerState & StatsAction,
  [],
  [],
  StatsAction
> = (set, get) => ({
  updateCustomerStats: () => {
    const { customers, agents } = get();

    if (!customers.length) {
      set({
        customerStats: {
          total: 0,
          byCategory: {},
          lastUpdated: new Date().toISOString(),
        }
      });
      return;
    }

    // 计算总数
    const total = customers.length;

    // 按Agent分类统计
    const byCategory: Record<string, number> = {};

    // 初始化所有Agent类别为0
    agents.forEach(agent => {
      byCategory[agent.id] = 0;
    });

    // 统计未分类客户
    byCategory['unclassified'] = 0;

    // 遍历客户进行分类统计
    customers.forEach(customer => {
      const agentId = customer.session.agentId;
      if (agentId && byCategory.hasOwnProperty(agentId)) {
        byCategory[agentId]++;
      } else {
        byCategory['unclassified']++;
      }
    });

    set({
      customerStats: {
        total,
        byCategory,
        lastUpdated: new Date().toISOString(),
      }
    });
  },

  fetchCustomerStats: async () => {
    set({ statsLoading: true });
    try {
      // 这里可以调用统计API，目前使用本地计算
      get().updateCustomerStats();
    } catch (error) {
      console.error('获取客户统计失败:', error);
    } finally {
      set({ statsLoading: false });
    }
  },

  clearCustomerStats: () => {
    set({
      customerStats: {
        total: 0,
        byCategory: {},
        lastUpdated: '',
      }
    });
  },
});
