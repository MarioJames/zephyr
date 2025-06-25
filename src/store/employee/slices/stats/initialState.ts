import { EmployeeStatsItem } from '../../initialState';

// ========== 统计功能状态接口 ==========
export interface StatsState {
  employeeStats: Record<string, EmployeeStatsItem>;
  statsLoading: boolean;
}

// ========== 统计功能初始状态 ==========
export const statsInitialState: StatsState = {
  employeeStats: {},
  statsLoading: false,
};
