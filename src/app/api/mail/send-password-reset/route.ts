import { NextRequest, NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyunMailServer';
import type { MailOptions } from '@/types/mail';

interface SendPasswordResetRequest {
  employeeId: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendPasswordResetRequest = await request.json();
    const { employeeId, email } = body;

    if (!employeeId) {
      return NextResponse.json({
        success: false,
        error: '员工ID不能为空',
      }, { status: 400 });
    }

    // 这里应该从数据库获取员工信息，包括邮箱
    // 为了演示，我们假设可以获取到邮箱
    const userEmail = email || `employee-${employeeId}@company.com`; // 实际应该从数据库查询

    // 生成重置令牌（实际项目中应该生成真实的令牌并存储到数据库）
    const resetToken = `reset_${employeeId}_${Date.now()}`;
    const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

    const mailService = AliyunMailServerService.createFromEnv();

    // 发送密码重置邮件
    const mailOptions: MailOptions = {
      to: userEmail,
      subject: `重置您的密码 - ${process.env.APP_NAME || '保险客户管理系统'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>密码重置请求</h2>
          <p>您好，</p>
          <p>我们收到了重置您账户密码的请求（员工ID：${employeeId}）。</p>
          <p>请点击下面的链接来重置您的密码：</p>
          <p>
            <a href="${resetLink}"
               style="display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px;">
              重置密码
            </a>
          </p>
          <p>或者复制以下链接到浏览器地址栏：</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 8px; border-radius: 4px;">
            ${resetLink}
          </p>
          <p><strong>重要提醒：</strong></p>
          <ul>
            <li>此链接将在 24小时 后失效</li>
            <li>如果您没有请求重置密码，请忽略此邮件</li>
            <li>为了账户安全，请勿将此链接分享给他人</li>
          </ul>
          <hr>
          <p style="color: #666; font-size: 12px;">
            此邮件由系统自动发送，请勿回复。<br>
            发送时间：${new Date().toLocaleString('zh-CN')}
          </p>
        </div>
      `,
    };

    const result = await mailService.sendMail(mailOptions);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '密码重置邮件发送成功',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `邮件发送失败: ${result.error}`,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('发送密码重置邮件失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器内部错误',
    }, { status: 500 });
  }
}
