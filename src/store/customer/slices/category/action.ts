import { StateCreator } from 'zustand/vanilla';
import { CustomerState } from '../../initialState';
import { sessionsAPI } from '@/services';
import { SessionStatGroupedByAgentItem } from '@/services/sessions';
import { CoreAction } from '../core/action';

// ========== 分类功能Action接口 ==========
export interface CategoryAction {
  setPagination: (page: number, pageSize: number) => void;
  setSelectedCategory: (category: SessionStatGroupedByAgentItem) => void;
  fetchCategoryStats: () => Promise<void>;
}

// ========== 分类功能Slice ==========
export const categorySlice: StateCreator<
  CustomerState & CategoryAction & CoreAction,
  [],
  [],
  CategoryAction
> = (set, get) => ({
  setPagination: (page: number, pageSize: number) => {
    set({ page, pageSize });

    // 调用 core slice 中的 fetchCustomers action，传递当前分类参数
    const state = get();
    if (state.selectedCategory) {
      const params = {
        page,
        pageSize,
        ...(state.selectedCategory.agent?.id !== 'ALL'
          ? { agentId: state.selectedCategory.agent?.id }
          : {})
      };

      state.fetchCustomers(params);
    }
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category, page: 1 });

    // 调用 core slice 中的 fetchCustomers action
    const state = get();
    // 根据选中的分类获取客户列表
    const params = {
      page: 1,
      pageSize: state.pageSize || 10,
      ...(category.agent?.id !== 'ALL'
        ? { agentId: category.agent?.id }
        : {})
    };

    state.fetchCustomers(params);
  },

  fetchCategoryStats: async () => {
    const data = await sessionsAPI.getSessionsGroupedByAgent();

    const categoryStats: SessionStatGroupedByAgentItem[] = [
      {
        agent: { id: 'ALL', title: '全部' },
        count: data.reduce((acc, item) => acc + item.count, 0),
      },
      ...data,
    ];

    set({ categoryStats });

    // 检查URL参数中的category字段
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    let selectedCategory: SessionStatGroupedByAgentItem;

    if (categoryFromUrl) {
      // 从URL中获取category值，查找对应的分类
      const foundCategory = categoryStats.find(
        (item) => item.agent?.id === categoryFromUrl
      );
      selectedCategory = foundCategory || categoryStats[0]; // 如果找不到则使用"全部"
    } else {
      // URL中没有category字段，使用"全部"分类
      selectedCategory = categoryStats[0];
    }

    const state = get();
    state.setSelectedCategory(selectedCategory);
  },
});
