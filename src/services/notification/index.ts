import { http } from '../request';

// 通知相关类型定义
export interface SendLoginGuideRequest {
  employeeId: string;
  email: string;
  employeeName?: string;
  [key: string]: unknown;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

/**
 * 发送登录引导邮件
 * @description 向指定员工发送包含登录信息的引导邮件
 * @param data SendLoginGuideRequest
 * @returns NotificationResponse
 */
function sendLoginGuideEmail(data: SendLoginGuideRequest) {
  return http.post<NotificationResponse>('/api/mail/send-login-guide', data);
}

/**
 * 发送密码重置邮件
 * @description 向指定员工发送密码重置邮件
 * @param employeeId string
 * @param email string (可选)
 * @returns NotificationResponse
 */
function sendPasswordResetEmail(employeeId: string, email?: string) {
  return http.post<NotificationResponse>('/api/mail/send-password-reset', {
    employeeId,
    email,
  });
}

export default {
  sendLoginGuideEmail,
  sendPasswordResetEmail,
};
