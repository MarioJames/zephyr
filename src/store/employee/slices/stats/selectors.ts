import { EmployeeState } from '../../initialState';

// ========== 统计功能选择器 ==========
export const statsSelectors = {
  // 获取所有员工统计数据
  employeeStats: (state: EmployeeState) => state.employeeStats,

  // 获取统计数据加载状态
  statsLoading: (state: EmployeeState) => state.statsLoading,

  // 根据员工ID获取统计数据
  getEmployeeStats: (state: EmployeeState) => (employeeId: string) =>
    state.employeeStats[employeeId] || null,

  // 获取员工的客户数量
  getCustomerCount: (state: EmployeeState) => (employeeId: string) =>
    state.employeeStats[employeeId]?.customerCount || 0,

  // 获取员工的消息数量
  getMessageCount: (state: EmployeeState) => (employeeId: string) =>
    state.employeeStats[employeeId]?.messageCount || 0,

  // 获取统计数据的最后更新时间
  getStatsLastUpdated: (state: EmployeeState) => (employeeId: string) =>
    state.employeeStats[employeeId]?.lastUpdated || null,

  // 检查员工是否有统计数据
  hasEmployeeStats: (state: EmployeeState) => (employeeId: string) =>
    Boolean(state.employeeStats[employeeId]),
};
