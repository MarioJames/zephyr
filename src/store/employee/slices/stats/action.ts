import { StateCreator } from 'zustand/vanilla';
import customerService from '@/services/customer';
import messagesService from '@/services/messages';
import { EmployeeState, EmployeeStatsItem } from '../../initialState';

// ========== 统计功能Action接口 ==========
export interface StatsAction {
  fetchEmployeeStats: (employeeId?: string) => Promise<void>;
  fetchAllEmployeeStats: () => Promise<void>;
  clearEmployeeStats: () => void;
}

// ========== 统计功能Slice ==========
export const statsSlice: StateCreator<
  EmployeeState & StatsAction,
  [],
  [],
  StatsAction
> = (set, get) => ({
  fetchEmployeeStats: async (employeeId) => {
    if (!employeeId) return;

    set({ statsLoading: true });
    try {
      // 获取员工消息统计
      const messageStats = await messagesService.countByUser({ userId: employeeId });
      const totalMessages = Object.values(messageStats).reduce((sum, count) => sum + count, 0);

      // 获取员工客户数量（模拟实现）
      const customerStats = await customerService.getCustomerList({
        search: '',
        page: 1,
        pageSize: 1000
      });
      // 这里需要根据实际API调整，假设返回的数据中有owner字段
      const customerCount = 0; // 需要根据实际API实现

      const stats: EmployeeStatsItem = {
        customerCount,
        messageCount: totalMessages,
        lastUpdated: new Date().toISOString(),
      };

      set(state => ({
        employeeStats: {
          ...state.employeeStats,
          [employeeId]: stats,
        },
      }));
    } catch (e: any) {
      console.warn('获取员工统计数据失败:', e?.message);
      // 统计数据获取失败不影响主功能，只记录警告
    } finally {
      set({ statsLoading: false });
    }
  },

  fetchAllEmployeeStats: async () => {
    const { employees } = get();
    for (const employee of employees) {
      await get().fetchEmployeeStats(employee.id);
    }
  },

  clearEmployeeStats: () => {
    set({ employeeStats: {} });
  },
});
