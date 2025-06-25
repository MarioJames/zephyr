import { coreSelectors } from './slices/core/selectors';
import { statsSelectors } from './slices/stats/selectors';
import { notificationSelectors } from './slices/notification/selectors';
import { searchSelectors } from './slices/search/selectors';

// ========== 导出所有选择器 ==========
export const employeeSelectors = {
  // 核心功能选择器
  ...coreSelectors,

  // 统计功能选择器
  ...statsSelectors,

  // 通知功能选择器
  ...notificationSelectors,

  // 搜索功能选择器
  ...searchSelectors,

  // 复合选择器
  getEmployeeWithStats: (state: any) => (employeeId: string) => {
    const employee = coreSelectors.getEmployeeById(state)(employeeId);
    const stats = statsSelectors.getEmployeeStats(state)(employeeId);
    const roleName = searchSelectors.getRoleName(state)(employee?.roleId || '');

    return {
      ...employee,
      stats,
      roleName,
    };
  },

  getEmployeeListWithStats: (state: any) => {
    const employees = searchSelectors.displayEmployees(state);
    return employees.map(employee => {
      const stats = statsSelectors.getEmployeeStats(state)(employee.id);
      const roleName = searchSelectors.getRoleName(state)(employee.roleId || '');

      return {
        ...employee,
        stats,
        roleName,
      };
    });
  },
};
