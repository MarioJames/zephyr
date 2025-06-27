import { CustomerState } from '../../initialState';

// ========== 搜索功能选择器 ==========
export const searchSelectors = {
  // 获取搜索关键词
  searchQuery: (state: CustomerState) => state.searchQuery,

  // 获取过滤后的客户列表
  filteredCustomers: (state: CustomerState) => state.filteredCustomers,

  // 获取当前页码
  currentPage: (state: CustomerState) => state.currentPage,

  // 获取每页大小
  pageSize: (state: CustomerState) => state.pageSize,

  // 获取排序字段
  sortField: (state: CustomerState) => state.sortField,

  // 获取排序顺序
  sortOrder: (state: CustomerState) => state.sortOrder,

  // 检查是否正在搜索
  isSearching: (state: CustomerState) => Boolean(state.searchQuery.trim()),

  // 获取过滤后的客户数量
  filteredCustomersCount: (state: CustomerState) => state.filteredCustomers.length,

  // 获取显示的客户列表（考虑搜索和分类过滤）
  displayCustomers: (state: CustomerState) => {
    return state.searchQuery.trim() || state.selectedCategory !== 'all'
      ? state.filteredCustomers
      : state.customers;
  },

  // 获取分页后的客户列表
  paginatedCustomers: (state: CustomerState) => {
    const { filteredCustomers, currentPage, pageSize, searchQuery, selectedCategory, customers } = state;

    // 确定要分页的数据源
    const dataSource = searchQuery.trim() || selectedCategory !== 'all'
      ? filteredCustomers
      : customers;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return dataSource.slice(startIndex, endIndex);
  },

  // 获取总页数
  totalPages: (state: CustomerState) => {
    const { filteredCustomers, pageSize, searchQuery, selectedCategory, customers } = state;

    const dataSource = searchQuery.trim() || selectedCategory !== 'all'
      ? filteredCustomers
      : customers;

    return Math.ceil(dataSource.length / pageSize);
  },

  // 检查是否有搜索结果
  hasSearchResults: (state: CustomerState) => {
    return state.searchQuery.trim() ? state.filteredCustomers.length > 0 : true;
  },

  // 获取分页信息
  paginationInfo: (state: CustomerState) => {
    const { currentPage, pageSize, filteredCustomers, searchQuery, selectedCategory, customers } = state;

    const dataSource = searchQuery.trim() || selectedCategory !== 'all'
      ? filteredCustomers
      : customers;

    const total = dataSource.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    return {
      currentPage,
      pageSize,
      total,
      totalPages,
      startIndex: startIndex + 1, // 显示从1开始
      endIndex,
      hasMore: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  },
};
