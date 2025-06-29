import { NextRequest, NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyun-mail-server';
import type { MailOptions } from '@/types/mail';

interface TestMailRequest {
  to: string;
  subject?: string;
  content?: string;
  type?: 'test' | 'system';
  notificationType?: 'welcome' | 'password_reset' | 'account_verification' | 'system_alert';
  data?: Record<string, string | number | boolean>;
}

export async function POST(request: NextRequest) {
  try {
    const body: TestMailRequest = await request.json();
    const { to, subject, content, type = 'test', notificationType, data } = body;

    if (!to) {
      return NextResponse.json({
        success: false,
        error: '收件人地址不能为空',
      }, { status: 400 });
    }

    const mailService = AliyunMailServerService.createFromEnv();

    if (type === 'system' && notificationType) {
      // 发送系统通知邮件 - 调用内部 API
      const notificationResponse = await fetch(`${process.env.APP_URL || 'http://localhost:3000'}/api/mail/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          type: notificationType,
          data: data || { message: content || '这是一封系统测试邮件' },
        }),
      });

      const result = await notificationResponse.json();
      return NextResponse.json({
        success: true,
        data: result,
      });
    } else {
      // 发送普通测试邮件
      const mailOptions: MailOptions = {
        to,
        subject: subject || '邮件功能测试',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>邮件功能测试</h2>
            <p>这是一封来自保险客户管理系统的测试邮件。</p>
            <p>${content || '如果您收到此邮件，说明邮件服务配置正确。'}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              发送时间: ${new Date().toLocaleString('zh-CN')}
            </p>
            <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
          </div>
        `,
        text: content || '这是一封来自保险客户管理系统的测试邮件。如果您收到此邮件，说明邮件服务配置正确。',
      };

      const result = await mailService.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    console.error('发送测试邮件失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '发送测试邮件失败',
    }, { status: 500 });
  }
}