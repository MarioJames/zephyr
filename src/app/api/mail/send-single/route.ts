import { NextRequest, NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyun-mail-server';
import type { MailOptions } from '@/types/mail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, attachments, from }: MailOptions = body;

    if (!to || !subject) {
      return NextResponse.json({
        success: false,
        error: '收件人和主题不能为空',
      }, { status: 400 });
    }

    const mailService = AliyunMailServerService.createFromEnv();
    const result = await mailService.sendMail({
      from,
      to,
      subject,
      html,
      text,
      attachments,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '发送邮件失败',
    }, { status: 500 });
  }
}