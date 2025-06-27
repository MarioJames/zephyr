import { StateCreator } from 'zustand/vanilla';
import { CustomerState } from '../../initialState';

// ========== 搜索功能Action接口 ==========
export interface SearchAction {
  setSearchQuery: (query: string) => void;
  filterCustomers: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (field: string, order: 'asc' | 'desc' | '') => void;
  clearSearch: () => void;
  resetPagination: () => void;
}

// ========== 搜索功能Slice ==========
export const searchSlice: StateCreator<
  CustomerState & SearchAction,
  [],
  [],
  SearchAction
> = (set, get) => ({
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().filterCustomers();
  },

  filterCustomers: () => {
    const { customers, searchQuery, selectedCategory, agents } = get();

    let filtered = [...customers];

    // 按搜索关键词过滤
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(customer => {
        return (
          customer.session.title?.toLowerCase().includes(searchTerm) ||
          customer.extend?.company?.toLowerCase().includes(searchTerm) ||
          customer.extend?.phone?.toLowerCase().includes(searchTerm) ||
          customer.extend?.email?.toLowerCase().includes(searchTerm) ||
          customer.extend?.wechat?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // 按类别过滤
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'unclassified') {
        // 过滤未分类客户
        filtered = filtered.filter(customer => !customer.session.agentId);
      } else {
        // 按Agent ID过滤
        filtered = filtered.filter(customer => customer.session.agentId === selectedCategory);
      }
    }

    set({ filteredCustomers: filtered });
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  setPageSize: (size) => {
    set({ pageSize: size, currentPage: 1 });
  },

  setSorting: (field, order) => {
    set({ sortField: field, sortOrder: order, currentPage: 1 });

    // 对过滤后的客户进行排序
    const { filteredCustomers } = get();
    if (!field || !order) {
      return;
    }

    const sorted = [...filteredCustomers].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'createTime':
          aValue = new Date(a.session.createdAt || 0).getTime();
          bValue = new Date(b.session.createdAt || 0).getTime();
          break;
        case 'lastContactTime':
          aValue = new Date(a.session.updatedAt || 0).getTime();
          bValue = new Date(b.session.updatedAt || 0).getTime();
          break;
        case 'name':
          aValue = a.session.title || '';
          bValue = b.session.title || '';
          break;
        case 'company':
          aValue = a.extend?.company || '';
          bValue = b.extend?.company || '';
          break;
        default:
          return 0;
      }

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    set({ filteredCustomers: sorted });
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      currentPage: 1,
      sortField: '',
      sortOrder: '',
    });
    get().filterCustomers();
  },

  resetPagination: () => {
    set({ currentPage: 1 });
  },
});
