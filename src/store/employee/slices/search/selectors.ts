import { EmployeeState } from '../../initialState';

// ========== 搜索功能选择器 ==========
export const searchSelectors = {
  searchedEmployees: (state: EmployeeState) => state.searchedEmployees,
};
