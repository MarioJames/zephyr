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

export default {
  sendLoginGuideEmail,
};
