import { EmployeeState } from '../../initialState';

// ========== 核心功能选择器 ==========
export const coreSelectors = {
  // 获取所有员工
  employees: (state: EmployeeState) => state.employees,

  // 获取所有角色
  roles: (state: EmployeeState) => state.roles,

  // 获取加载状态
  loading: (state: EmployeeState) => state.loading,

  // 获取错误信息
  error: (state: EmployeeState) => state.error,

  // 根据ID获取员工
  getEmployeeById: (state: EmployeeState) => (id: string) =>
    state.employees.find(emp => emp.id === id),

  // 根据ID获取角色
  getRoleById: (state: EmployeeState) => (id: string) =>
    state.roles.find(role => role.id === id),

  // 获取员工总数
  employeeCount: (state: EmployeeState) => state.employees.length,

  // 获取角色总数
  roleCount: (state: EmployeeState) => state.roles.length,
};
