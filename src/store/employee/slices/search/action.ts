import { StateCreator } from 'zustand/vanilla';
import { EmployeeState } from '../../initialState';
import { userAPI } from '@/services';

// ========== 搜索功能Action接口 ==========
export interface SearchAction {
  searchEmployees: (keyword: string, pageSize: number) => Promise<void>;
}

// ========== 搜索功能Slice ==========
export const searchSlice: StateCreator<
  EmployeeState & SearchAction,
  [],
  [],
  SearchAction
> = (set, get) => ({
  searchEmployees: async (keyword: string, pageSize: number) => {
    // 创建请求键用于去重
    const searchKey = `${keyword || ''}:${pageSize}`;
    const state = get();
    
    // 如果已有相同的请求在进行中，直接返回
    if (state.pendingSearchKeys.has(searchKey)) {
      return;
    }

    // 标记请求开始
    const newPendingKeys = new Set(state.pendingSearchKeys);
    newPendingKeys.add(searchKey);
    set({ 
      loading: true, 
      searchQuery: keyword,
      pendingSearchKeys: newPendingKeys
    });

    try {
      const employees = await userAPI.searchUsers(keyword || '', pageSize);

      // 移除请求标记并更新结果
      const finalPendingKeys = new Set(get().pendingSearchKeys);
      finalPendingKeys.delete(searchKey);
      set({ 
        employees,
        searchedEmployees: employees,
        loading: false,
        pendingSearchKeys: finalPendingKeys
      });
    } catch (e: any) {
      // 移除请求标记
      const finalPendingKeys = new Set(get().pendingSearchKeys);
      finalPendingKeys.delete(searchKey);
      set({ 
        employees: [],
        searchedEmployees: [],
        loading: false,
        pendingSearchKeys: finalPendingKeys
      });
    }
  },
});
