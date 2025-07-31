import { CoreState , coreInitialState } from './slices/core/initialState';
import { CategoryState , categoryInitialState } from './slices/category/initialState';

// ========== 客户统计数据接口 ==========
export interface CustomerStatsItem {
  total: number;
  byCategory: Record<string, number>;
  lastUpdated: string;
}

// ========== 全局状态接口 ==========
export type CustomerState = CoreState & CategoryState;

// ========== 初始状态 ==========
export const initialState: CustomerState = {
  ...coreInitialState,
  ...categoryInitialState,
};
