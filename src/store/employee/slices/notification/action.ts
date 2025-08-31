import { StateCreator } from 'zustand/vanilla';
import notificationService, {
  SendLoginGuideRequest,
} from '@/services/notification';
import { EmployeeState } from '../../initialState';

// ========== 通知功能Action接口 ==========
export interface NotificationAction {
  sendLoginGuideEmail: (employeeId: string) => Promise<void>;
  clearNotificationError: () => void;
}

// ========== 通知功能Slice ==========
export const notificationSlice: StateCreator<
  EmployeeState & NotificationAction,
  [],
  [],
  NotificationAction
> = (set, get) => ({
  sendLoginGuideEmail: async (employeeId) => {
    const { employees } = get();
    const employee = employees.find((emp) => emp.id === employeeId);

    if (!employee || !employee.email) {
      set({ notificationError: '员工信息不完整，无法发送邮件' });
      return;
    }

    set({ notificationLoading: true, notificationError: null });
    try {
      const emailData: SendLoginGuideRequest = {
        employeeId,
        email: employee.email,
        employeeName: employee.fullName || employee.username,
      };

      await notificationService.sendLoginGuideEmail(emailData);
    } catch (e: any) {
      set({ notificationError: e?.message || '发送登录引导邮件失败' });
    } finally {
      set({ notificationLoading: false });
    }
  },

  clearNotificationError: () => {
    set({ notificationError: null });
  },
});
