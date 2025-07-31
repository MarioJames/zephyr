import { NextRequest, NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyunMailServer';
import type { MailOptions } from '@/types/mail';
import { zephyrEnv } from '@/env/zephyr';

// 处理模板变量替换
function processTemplate(template: string, variables?: Record<string, string | number | boolean>): string {
  if (!variables) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}

interface SystemNotificationRequest {
  to: string | string[];
  type: 'welcome' | 'password_reset' | 'account_verification' | 'system_alert';
  data?: Record<string, string | number | boolean>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SystemNotificationRequest = await request.json();
    const { to, type, data } = body;

    if (!to || !type) {
      return NextResponse.json({
        success: false,
        error: '收件人和通知类型不能为空',
      }, { status: 400 });
    }

    const templates = {
      welcome: {
        subject: '欢迎加入{{appName}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>欢迎加入{{appName}}！</h2>
            <p>亲爱的{{userName}}，</p>
            <p>感谢您注册我们的保险客户管理系统。您的账户已成功创建。</p>
            <p>您可以开始使用我们的智能客户管理和对话功能了。</p>
            <p>如有任何问题，请随时联系我们的客服团队。</p>
            <hr>
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
      },
      password_reset: {
        subject: '重置您的密码 - {{appName}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>密码重置请求</h2>
            <p>您好，</p>
            <p>我们收到了重置您账户密码的请求。请点击下面的链接来重置您的密码：</p>
            <p><a href="{{resetLink}}" style="color: #007bff;">重置密码</a></p>
            <p>如果您没有请求重置密码，请忽略此邮件。此链接将在24小时后失效。</p>
            <hr>
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
      },
      account_verification: {
        subject: '验证您的账户 - {{appName}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>账户验证</h2>
            <p>您好，</p>
            <p>请点击下面的链接来验证您的账户：</p>
            <p><a href="{{verificationLink}}" style="color: #007bff;">验证账户</a></p>
            <p>或者输入验证码：<strong>{{verificationCode}}</strong></p>
            <hr>
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
      },
      system_alert: {
        subject: '系统通知 - {{appName}}',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>系统通知</h2>
            <p>{{message}}</p>
            <p>时间：{{timestamp}}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
      },
    };

    const template = templates[type];
    const defaultData = {
      appName: zephyrEnv.NEXT_PUBLIC_APP_NAME,
      timestamp: new Date().toLocaleString('zh-CN'),
      ...data,
    };

    const mailOptions: MailOptions = {
      to,
      subject: processTemplate(template.subject, defaultData),
      html: processTemplate(template.html, defaultData),
    };

    const mailService = AliyunMailServerService.createFromEnv();
    const result = await mailService.sendMail(mailOptions);

    return NextResponse.json(result);
  } catch (error) {
    console.error('发送系统通知邮件失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '发送系统通知邮件失败',
    }, { status: 500 });
  }
}
