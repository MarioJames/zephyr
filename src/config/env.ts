import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    // NextAuth 配置
    NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
    NEXTAUTH_URL: z.string().url().optional(),

    // Clerk 配置
    CLERK_SECRET_KEY: z.string().optional(),
    CLERK_PUBLISHABLE_KEY: z.string().optional(),

    // 邮件服务配置
    ALIYUN_MAIL_SMTP_HOST: z.string().optional(),
    ALIYUN_MAIL_SMTP_PORT: z.string().optional(),
    ALIYUN_MAIL_SMTP_USER: z.string().optional(),
    ALIYUN_MAIL_SMTP_PASS: z.string().optional(),
    ALIYUN_MAIL_SMTP_SECURE: z.string().optional(),

    // 应用配置
    APP_NAME: z.string().optional(),
    APP_URL: z.string().optional(),
    SUPPORT_EMAIL: z.string().optional(),
  },
  client: {
    // 客户端可访问的环境变量
    NEXT_PUBLIC_SERVICE_MODE: z.string().optional(),
    NEXT_PUBLIC_LOBE_HOST: z.string().optional(),
    NEXT_PUBLIC_OIDC_AUTHORITY: z.string().optional(),
    NEXT_PUBLIC_OIDC_CLIENT_ID: z.string().optional(),
  },
  runtimeEnv: {
    // NextAuth 环境变量
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    // 服务端环境变量
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,

    ALIYUN_MAIL_SMTP_HOST: process.env.ALIYUN_MAIL_SMTP_HOST,
    ALIYUN_MAIL_SMTP_PORT: process.env.ALIYUN_MAIL_SMTP_PORT,
    ALIYUN_MAIL_SMTP_USER: process.env.ALIYUN_MAIL_SMTP_USER,
    ALIYUN_MAIL_SMTP_PASS: process.env.ALIYUN_MAIL_SMTP_PASS,
    ALIYUN_MAIL_SMTP_SECURE: process.env.ALIYUN_MAIL_SMTP_SECURE,

    APP_NAME: process.env.APP_NAME,
    APP_URL: process.env.APP_URL,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,

    // 客户端环境变量
    NEXT_PUBLIC_SERVICE_MODE: process.env.NEXT_PUBLIC_SERVICE_MODE,
    NEXT_PUBLIC_LOBE_HOST: process.env.NEXT_PUBLIC_LOBE_HOST,
    NEXT_PUBLIC_OIDC_AUTHORITY: process.env.NEXT_PUBLIC_OIDC_AUTHORITY,
    NEXT_PUBLIC_OIDC_CLIENT_ID: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID,
  },
});
