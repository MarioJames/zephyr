import { NextResponse } from 'next/server';
import { AliyunMailServerService } from '@/libs/aliyun-mail-server';

export async function GET() {
  try {
    const mailService = AliyunMailServerService.createFromEnv();
    const connected = await mailService.verifyConnection();
    
    return NextResponse.json({
      success: true,
      data: {
        connected,
        lastChecked: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('邮件连接验证失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '邮件连接验证失败',
      data: {
        connected: false,
        lastChecked: new Date().toISOString(),
      },
    }, { status: 500 });
  }
}