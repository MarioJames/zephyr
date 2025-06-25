import { EmployeeState } from '../../initialState';

// ========== 通知功能选择器 ==========
export const notificationSelectors = {
  // 获取通知加载状态
  notificationLoading: (state: EmployeeState) => state.notificationLoading,

  // 获取通知错误信息
  notificationError: (state: EmployeeState) => state.notificationError,

  // 检查是否有通知错误
  hasNotificationError: (state: EmployeeState) => Boolean(state.notificationError),
};
