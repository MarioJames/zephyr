import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

// 邮件服务配置
function getMailEnv() {
  return createEnv({
    server: {
      ALIYUN_MAIL_SMTP_HOST: z.string(),
      ALIYUN_MAIL_SMTP_PORT: z.string(),
      ALIYUN_MAIL_SMTP_USER: z.string(),
      ALIYUN_MAIL_SMTP_PASS: z.string(),
      ALIYUN_MAIL_SMTP_SECURE: z.boolean(),
    },
    runtimeEnv: {
      ALIYUN_MAIL_SMTP_HOST:
        process.env.ALIYUN_MAIL_SMTP_HOST || 'smtpdm.aliyun.com',
      ALIYUN_MAIL_SMTP_PORT: process.env.ALIYUN_MAIL_SMTP_PORT || '25',
      ALIYUN_MAIL_SMTP_USER: process.env.ALIYUN_MAIL_SMTP_USER || '',
      ALIYUN_MAIL_SMTP_PASS: process.env.ALIYUN_MAIL_SMTP_PASS || '',
      ALIYUN_MAIL_SMTP_SECURE: process.env.ALIYUN_MAIL_SMTP_SECURE === '1',
    },
  });
}

export const mailEnv = getMailEnv();
