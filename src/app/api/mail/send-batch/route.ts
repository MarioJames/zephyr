import { NextRequest, NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyunMailServer';
import type { BatchMailOptions, MailOptions, MailResponse } from '@/types/mail';

// 处理模板变量替换
function processTemplate(template: string, variables?: Record<string, string | number | boolean>): string {
  if (!variables) return template;

  return template.replaceAll(/{{(\w+)}}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchMailOptions = await request.json();
    const { template, recipients, from } = body;

    if (!template || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json({
        success: false,
        error: '模板和收件人列表不能为空',
      }, { status: 400 });
    }

    const mailService = AliyunMailServerService.createFromEnv();
    const results: MailResponse[] = [];

    for (const recipient of recipients) {
      try {
        // 替换模板变量
        const processedSubject = processTemplate(template.subject, recipient.variables);
        const processedHtml = processTemplate(template.htmlContent, recipient.variables);
        const processedText = template.textContent
          ? processTemplate(template.textContent, recipient.variables)
          : undefined;

        const mailOptions: MailOptions = {
          from,
          to: recipient.to,
          subject: processedSubject,
          html: processedHtml,
          text: processedText,
        };

        const result = await mailService.sendMail(mailOptions);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : '批量发送邮件失败',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('批量发送邮件失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '批量发送邮件失败',
    }, { status: 500 });
  }
}
