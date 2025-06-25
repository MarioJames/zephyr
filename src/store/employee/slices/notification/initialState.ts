// ========== 通知功能状态接口 ==========
export interface NotificationState {
  notificationLoading: boolean;
  notificationError: string | null;
}

// ========== 通知功能初始状态 ==========
export const notificationInitialState: NotificationState = {
  notificationLoading: false,
  notificationError: null,
};
