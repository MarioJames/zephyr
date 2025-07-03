import { coreSelectors } from './slices/core/selectors';
import { notificationSelectors } from './slices/notification/selectors';
import { searchSelectors } from './slices/search/selectors';

// ========== 导出所有选择器 ==========
export const employeeSelectors = {
  // 核心功能选择器
  ...coreSelectors,

  // 通知功能选择器
  ...notificationSelectors,

  // 搜索功能选择器
  ...searchSelectors,
};
