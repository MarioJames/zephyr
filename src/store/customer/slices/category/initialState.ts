import { AgentItem } from '@/services/agents';

// ========== 分类功能状态接口 ==========
export interface CategoryState {
  selectedCategory: string;
  categoryStats: Record<string, number>;
  agents: AgentItem[];
}

// ========== 分类功能初始状态 ==========
export const categoryInitialState: CategoryState = {
  selectedCategory: 'all',
  categoryStats: {},
  agents: [],
};
