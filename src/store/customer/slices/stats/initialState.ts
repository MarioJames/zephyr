import { CustomerStatsItem } from '../../initialState';

// ========== 统计功能状态接口 ==========
export interface StatsState {
  customerStats: CustomerStatsItem;
  statsLoading: boolean;
}

// ========== 统计功能初始状态 ==========
export const statsInitialState: StatsState = {
  customerStats: {
    total: 0,
    byCategory: {},
    lastUpdated: '',
  },
  statsLoading: false,
};
