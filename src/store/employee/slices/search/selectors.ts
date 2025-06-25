import { EmployeeState } from '../../initialState';

// ========== 搜索功能选择器 ==========
export const searchSelectors = {
  // 获取搜索关键词
  searchQuery: (state: EmployeeState) => state.searchQuery,

  // 获取过滤后的员工列表
  filteredEmployees: (state: EmployeeState) => state.filteredEmployees,

  // 获取角色映射
  roleMap: (state: EmployeeState) => state.roleMap,

  // 获取角色名称
  getRoleName: (state: EmployeeState) => (roleId: string) =>
    state.roleMap[roleId] || '未知角色',

  // 检查是否正在搜索
  isSearching: (state: EmployeeState) => Boolean(state.searchQuery.trim()),

  // 获取过滤后的员工数量
  filteredEmployeeCount: (state: EmployeeState) => state.filteredEmployees.length,

  // 获取显示的员工列表（搜索时显示过滤结果，否则显示所有员工）
  displayEmployees: (state: EmployeeState) =>
    state.searchQuery.trim() ? state.filteredEmployees : state.employees,
};
