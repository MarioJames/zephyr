import { StateCreator } from 'zustand/vanilla';
import customerService from '@/services/customer';
import messagesService from '@/services/messages';
import { EmployeeState, EmployeeStatsItem } from '../../initialState';
import { requestDeduplicator, debounce } from '@/utils/request-deduplication';

// ========== 统计功能Action接口 ==========
export interface StatsAction {
  fetchEmployeeStats: (employeeId?: string, force?: boolean) => Promise<void>;
  fetchAllEmployeeStats: (force?: boolean) => Promise<void>;
  fetchEmployeeStatsOnDemand: (employeeId: string) => Promise<void>;
  clearEmployeeStats: () => void;
}

// ========== 统计功能Slice ==========
export const statsSlice: StateCreator<
  EmployeeState & StatsAction,
  [],
  [],
  StatsAction
> = (set, get) => ({
  fetchEmployeeStats: async (employeeId, force = false) => {
    if (!employeeId) return;

    // 检查缓存：如果数据存在且未过期（5分钟），且非强制刷新，则跳过
    const { employeeStats } = get();
    const existingStats = employeeStats[employeeId];
    if (!force && existingStats) {
      const lastUpdated = new Date(existingStats.lastUpdated);
      const now = new Date();
      const diffMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
      if (diffMinutes < 5) {
        return; // 缓存未过期，直接返回
      }
    }

    // 使用请求去重避免重复调用
    const requestKey = {
      url: `/employee-stats/${employeeId}`,
      method: 'GET',
      params: { employeeId, force },
    };

    try {
      await requestDeduplicator.deduplicateRequest(requestKey, async () => {
        set({ statsLoading: true });

        // 获取员工消息统计
        const messageStats = await messagesService.countByUser({
          userId: employeeId,
        });
        const totalMessages = Object.values(messageStats).reduce(
          (sum, count) => sum + count,
          0
        );

        // 获取员工客户数量（优化：避免获取大量数据）
        // 这里应该有专门的API来获取员工客户数量，暂时保持现有逻辑
        const customerStats = await customerService.getCustomerList({
          search: '',
          page: 1,
          pageSize: 1000,
        });
        const customerCount = 0; // 需要根据实际API实现

        const stats: EmployeeStatsItem = {
          customerCount,
          messageCount: totalMessages,
          lastUpdated: new Date().toISOString(),
        };

        set((state) => ({
          employeeStats: {
            ...state.employeeStats,
            [employeeId]: stats,
          },
        }));
      });
    } catch (e: any) {
      console.warn('获取员工统计数据失败:', e?.message);
    } finally {
      set({ statsLoading: false });
    }
  },

  fetchAllEmployeeStats: async (force = false) => {
    const { employees } = get();

    // 批量处理，避免一次性发出太多请求
    const BATCH_SIZE = 3;
    for (let i = 0; i < employees.length; i += BATCH_SIZE) {
      const batch = employees.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((employee) => get().fetchEmployeeStats(employee.id, force))
      );
    }
  },

  fetchEmployeeStatsOnDemand: async (employeeId: string) => {
    // 按需获取单个员工统计数据，带防抖
    const debouncedFetch = debounce(
      () => get().fetchEmployeeStats(employeeId, false),
      300
    );
    debouncedFetch();
  },

  clearEmployeeStats: () => {
    set({ employeeStats: {} });
  },
});
