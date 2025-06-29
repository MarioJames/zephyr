import { http } from '../request';
import type {
  SendSingleMailRequest,
  SendBatchMailRequest,
  SendNotificationRequest,
  TestMailRequest,
  MailApiResponse,
  MailResponse,
  MailServiceStatus,
} from '@/types/mail';

/**
 * 发送单封邮件
 * @description 发送单封邮件到指定收件人
 * @param data SendSingleMailRequest
 * @returns MailResponse
 */
function sendSingleMail(data: SendSingleMailRequest) {
  return http.post<MailApiResponse<MailResponse>>(
    '/api/mail/send-single',
    data
  );
}

/**
 * 批量发送邮件
 * @description 使用模板批量发送邮件
 * @param data SendBatchMailRequest
 * @returns MailResponse[]
 */
function sendBatchMail(data: SendBatchMailRequest) {
  return http.post<MailApiResponse<MailResponse[]>>(
    '/api/mail/send-batch',
    data
  );
}

/**
 * 发送系统通知邮件
 * @description 发送预定义的系统通知邮件
 * @param data SendNotificationRequest
 * @returns MailResponse
 */
function sendNotificationMail(data: SendNotificationRequest) {
  return http.post<MailApiResponse<MailResponse>>(
    '/api/mail/send-notification',
    data
  );
}

/**
 * 验证邮件服务连接
 * @description 验证邮件服务的连接状态
 * @returns MailServiceStatus
 */
function verifyMailConnection() {
  return http.get<MailApiResponse<MailServiceStatus>>('/api/mail/verify');
}

/**
 * 发送欢迎邮件
 * @param to 收件人邮箱
 * @param userName 用户名
 */
function sendWelcomeMail(to: string, userName: string) {
  return sendNotificationMail({
    to,
    type: 'welcome',
    data: { userName },
  });
}

/**
 * 发送密码重置邮件
 * @param to 收件人邮箱
 * @param resetLink 重置链接
 */
function sendPasswordResetMail(to: string, resetLink: string) {
  return sendNotificationMail({
    to,
    type: 'password_reset',
    data: { resetLink },
  });
}

/**
 * 发送登录引导邮件
 * @param employeeId 员工ID
 * @param email 邮箱地址
 * @param employeeName 员工姓名
 */
function sendLoginGuideMail(
  employeeId: string,
  email: string,
  employeeName?: string
) {
  return http.post<MailApiResponse<{ message: string; timestamp: string }>>(
    '/api/mail/send-login-guide',
    {
      employeeId,
      email,
      employeeName,
    }
  );
}

/**
 * 发送密码重置邮件（员工版）
 * @param employeeId 员工ID
 * @param email 邮箱地址（可选，如果不提供则从数据库获取）
 */
function sendEmployeePasswordResetMail(employeeId: string, email?: string) {
  return http.post<MailApiResponse<{ message: string; timestamp: string }>>(
    '/api/mail/send-password-reset',
    {
      employeeId,
      email,
    }
  );
}

export default {
  sendSingleMail,
  sendBatchMail,
  sendNotificationMail,
  verifyMailConnection,

  // 便捷函数
  sendWelcomeMail,
  sendPasswordResetMail,
  // 业务邮件函数
  sendLoginGuideMail,
  sendEmployeePasswordResetMail,
};

// 导出类型定义
export type {
  SendSingleMailRequest,
  SendBatchMailRequest,
  SendNotificationRequest,
  TestMailRequest,
  MailApiResponse,
  MailResponse,
  MailServiceStatus,
};
