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

export interface MailApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
