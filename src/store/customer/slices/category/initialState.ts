import { SessionStatGroupedByAgentItem } from '@/services/sessions';

const ALL_CATEGORY_ID = 'ALL';

export interface CategoryState {
  page: number;
  pageSize: number;
  selectedCategory: SessionStatGroupedByAgentItem;
  categoryStats: SessionStatGroupedByAgentItem[];
}

export const categoryInitialState: CategoryState = {
  page: 1,
  pageSize: 20,
  selectedCategory: {
    agent: { id: ALL_CATEGORY_ID, title: '全部' },
    count: 0,
  },
  categoryStats: [],
};
