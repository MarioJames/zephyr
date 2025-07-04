import { NextRequest, NextResponse } from 'next/server';
import { clerkBackend } from '@/libs/clerk-backend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, fullName } = body;

    // 验证必需字段
    if (!email || !username) {
      return NextResponse.json(
        { error: '邮箱和用户名是必需的' },
        { status: 400 }
      );
    }

    // 使用 base64 编码用户名用于 Clerk，并转换为 URL 安全格式
    const clerkUsername = Buffer.from(username, 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')  // 替换 + 为 -
      .replace(/\//g, '_')  // 替换 / 为 _
      .replace(/=/g, '');   // 移除填充字符 =

    // 验证用户名长度（Clerk 要求 4-64 个字符）
    if (clerkUsername.length < 4 || clerkUsername.length > 64) {
      return NextResponse.json(
        { error: '用户名过长，请使用较短的用户名' },
        { status: 400 }
      );
    }

    // 在 Clerk 中创建用户
    const clerkUser = await clerkBackend.users.createUser({
      emailAddress: [email],
      username: clerkUsername,
      firstName: fullName || username, // 使用完整的中文姓名作为 firstName
      lastName: '', // lastName 留空
      password: 'Zephyr.default',
      // 在 publicMetadata 中存储原始信息，方便查询和显示
      publicMetadata: {
        originalUsername: username, // 原始中文用户名
        originalFullName: fullName || username, // 原始中文全名
        displayName: username, // 用于显示的名称
      },
      // 在 privateMetadata 中存储敏感或内部信息
      privateMetadata: {
        source: 'employee_management', // 标识来源
        createdBy: 'admin', // 创建者
        encodedUsername: clerkUsername, // base64编码后的用户名
      },
    });

    return NextResponse.json({
      success: true,
      userId: clerkUser.id,
      username: username, // 返回原始用户名
      clerkUsername: clerkUsername, // 返回 base64 编码的 Clerk 用户名
      message: '用户创建成功'
    });

  } catch (error: any) {
    console.error('Clerk 用户创建失败:', error);
    
    // 如果是 Clerk 错误，返回更详细的信息
    if (error.clerkError && error.errors) {
      console.error('Clerk 错误详情:', error.errors);
      return NextResponse.json(
        { 
          error: '用户创建失败', 
          details: error.errors[0]?.message || error.message,
          clerkErrors: error.errors
        },
        { status: error.status || 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: '用户创建失败', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}