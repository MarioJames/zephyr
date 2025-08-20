import { NextRequest, NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyunMailServer';
import type { MailOptions } from '@/types/mail';
import { zephyrEnv } from '@/env/zephyr';

interface SendLoginGuideRequest {
  employeeId: string;
  email: string;
  employeeName?: string;
}


export async function POST(request: NextRequest) {
  try {
    const body: SendLoginGuideRequest = await request.json();
    const { employeeId, email, employeeName } = body;

    if (!employeeId || !email) {
      return NextResponse.json(
        {
          success: false,
          error: '员工ID和邮箱地址不能为空',
        },
        { status: 400 }
      );
    }

    const mailService = AliyunMailServerService.createFromEnv();

    // 发送登录引导邮件模板
    const mailOptions: MailOptions = {
      to: email,
      subject: `欢迎加入${zephyrEnv.NEXT_PUBLIC_APP_NAME || '保险客户管理系统'} - 登录引导`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000;">欢迎加入${zephyrEnv.NEXT_PUBLIC_APP_NAME || '保险客户管理系统'}！</h2>
          <p style="color: #000;">亲爱的${employeeName || '用户'}，</p>
          <p style="color: #000;">您的账户已成功创建</p>
          <p style="color: #333;">登陆账号：${email}</p>
          <p style="color: #333;">默认密码：zephyr.default，请尽快登陆系统并修改密码</p>
          <p>
            <a href="${zephyrEnv.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}"
               style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
              立即登录
            </a>
          </p>
          <p style="color: #333;">如有任何问题，请联系企业管理员</p>
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
        message: '登录引导邮件发送成功',
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `邮件发送失败: ${result.error}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('发送登录引导邮件失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器内部错误',
      },
      { status: 500 }
    );
  }
}
