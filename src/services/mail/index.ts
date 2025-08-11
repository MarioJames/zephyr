import { http } from '../request';
import type { MailApiResponse } from '@/types/mail';

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
    '/api/mail/guide',
    {
      employeeId,
      email,
      employeeName,
    }
  );
}

export default {
  sendLoginGuideMail,
};

// 导出类型定义
export type { MailApiResponse } from '@/types/mail';
