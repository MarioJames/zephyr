export interface MailAttachment {
  filename: string;
  content: string | Buffer;
  path?: string;
  contentType?: string;
  encoding?: string;
  cid?: string;
}

export interface MailAddress {
  name?: string;
  address: string;
}

export interface MailOptions {
  from?: string | MailAddress;
  to: string | string[] | MailAddress | MailAddress[];
  cc?: string | string[] | MailAddress | MailAddress[];
  bcc?: string | string[] | MailAddress | MailAddress[];
  replyTo?: string | MailAddress;
  subject: string;
  text?: string;
  html?: string;
  attachments?: MailAttachment[];
  headers?: Record<string, string>;
  priority?: 'high' | 'normal' | 'low';
}

export interface MailResponse {
  success: boolean;
  messageId?: string;
  response?: string;
  error?: string;
  envelope?: {
    from: string;
    to: string[];
  };
}

export interface AliyunSMTPConfig {
  host: string;
  port: number;
  secure?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface AliyunAPIConfig {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint?: string;
  region?: string;
}

export interface AliyunMailConfig {
  smtp?: AliyunSMTPConfig;
  api?: AliyunAPIConfig;
  defaultFrom?: string | MailAddress;
}

export interface MailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables?: Record<string, string | number | boolean>;
}

export interface BatchMailOptions {
  template: MailTemplate;
  recipients: Array<{
    to: string | MailAddress;
    variables?: Record<string, string | number | boolean>;
  }>;
  from?: string | MailAddress;
}

export interface MailServiceStatus {
  connected: boolean;
  lastChecked: Date;
  error?: string;
}

export type MailServiceProvider = 'aliyun' | 'smtp' | 'sendgrid' | 'other';

export interface MailServiceConfig {
  provider: MailServiceProvider;
  config: AliyunMailConfig;
  enabled: boolean;
}

// API 请求和响应类型
export interface SendSingleMailRequest {
  to: string | string[] | MailAddress | MailAddress[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: MailAttachment[];
  from?: string | MailAddress;
}

export interface SendBatchMailRequest {
  template: MailTemplate;
  recipients: Array<{
    to: string | MailAddress;
    variables?: Record<string, string | number | boolean>;
  }>;
  from?: string | MailAddress;
}

export interface SendNotificationRequest {
  to: string | string[];
  type: 'welcome' | 'password_reset' | 'account_verification' | 'system_alert';
  data?: Record<string, string | number | boolean>;
}

export interface TestMailRequest {
  to: string;
  subject?: string;
  content?: string;
  type?: 'test' | 'system';
  notificationType?: 'welcome' | 'password_reset' | 'account_verification' | 'system_alert';
  data?: Record<string, string | number | boolean>;
}

export interface MailApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// 业务邮件请求类型
export interface SendLoginGuideRequest {
  employeeId: string;
  email: string;
  employeeName?: string;
}

export interface SendEmployeePasswordResetRequest {
  employeeId: string;
  email?: string;
}

// 业务邮件响应类型
export interface NotificationResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
