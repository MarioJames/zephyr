import { StateCreator } from 'zustand/vanilla';
import { EmployeeState } from '../../initialState';
import { userAPI } from '@/services';

// ========== 搜索功能Action接口 ==========
export interface SearchAction {
  searchEmployees: (keyword: string, pageSize: number, reset?: boolean) => Promise<void>;
  loadMoreEmployees: (keyword: string, pageSize: number) => Promise<void>;
  clearSearch: () => void;
}

// ========== 搜索功能Slice ==========
export const searchSlice: StateCreator<
  EmployeeState & SearchAction,
  [],
  [],
  SearchAction
> = (set, get) => ({
  searchEmployees: async (keyword: string, pageSize: number, reset: boolean = true) => {
    
    const searchKey = `${keyword || ''}:${pageSize}`;
    const state = get();
    
    // 如果已有相同的请求在进行中，直接返回
    if (state.pendingSearchKeys.has(searchKey)) {
      return;
    }

    // 标记请求开始
    const newPendingKeys = new Set(state.pendingSearchKeys);
    newPendingKeys.add(searchKey);
    
    if (reset) {
      // 重置搜索，从第一页开始
      set({ 
        loading: true, 
        searchQuery: keyword,
        pendingSearchKeys: newPendingKeys,
        currentPage: 1,
        hasMore: true,
        loadingMore: false
      });
    } else {
      // 加载更多，设置loadingMore状态
      set({ 
        loadingMore: true,
        pendingSearchKeys: newPendingKeys
      });
    }

    try {
      const currentPage = reset ? 1 : state.currentPage;
      const pageToRequest = reset ? 1 : currentPage + 1; // 加载更多时请求下一页
      const employees = await userAPI.searchUsers(keyword || '', pageSize, pageToRequest);
      // 过滤掉占位用户
      const filtered = (employees || []).filter((u) => u.id !== 'unassigned');

      // 移除请求标记
      const finalPendingKeys = new Set(get().pendingSearchKeys);
      finalPendingKeys.delete(searchKey);

      if (reset) {
        // 重置搜索，直接替换结果
        set({ 
          searchQuery: keyword,
          searchedEmployees: filtered,
          loading: false,
          pendingSearchKeys: finalPendingKeys,
          currentPage: 1,
          hasMore: filtered.length === pageSize
        });
      } else {
        // 加载更多，追加结果
        const existingEmployees = get().searchedEmployees;
        const newEmployees = [...existingEmployees, ...filtered];
        set({ 
          searchedEmployees: newEmployees,
          loadingMore: false,
          pendingSearchKeys: finalPendingKeys,
          currentPage: pageToRequest, // 使用实际请求的页码
          hasMore: filtered.length === pageSize
        });
      }
    } catch {
      // 移除请求标记
      const finalPendingKeys = new Set(get().pendingSearchKeys);
      finalPendingKeys.delete(searchKey);
      
      if (reset) {
        set({ 
          searchedEmployees: [],
          loading: false,
          pendingSearchKeys: finalPendingKeys,
          currentPage: 1,
          hasMore: false
        });
      } else {
        set({ 
          loadingMore: false,
          pendingSearchKeys: finalPendingKeys
        });
      }
    }
  },

  loadMoreEmployees: async (keyword: string, pageSize: number) => {
    const state = get();
    if (state.loadingMore || !state.hasMore) {
      return;
    }
    
    await get().searchEmployees(keyword, pageSize, false);
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchedEmployees: [],
      currentPage: 1,
      hasMore: true,
      loadingMore: false,
      pendingSearchKeys: new Set(),
    });
  },
});
