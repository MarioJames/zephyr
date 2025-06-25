import { http } from "../request";

// 通知相关类型定义
export interface SendLoginGuideRequest {
  employeeId: string;
  email: string;
  employeeName?: string;
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
  return http.post<NotificationResponse>('/api/v1/notifications/send-login-guide', data);
}

/**
 * 发送密码重置邮件
 * @description 向指定员工发送密码重置邮件
 * @param employeeId string
 * @returns NotificationResponse
 */
function sendPasswordResetEmail(employeeId: string) {
  return http.post<NotificationResponse>('/api/v1/notifications/send-password-reset', { employeeId });
}

export default {
  sendLoginGuideEmail,
  sendPasswordResetEmail,
};
