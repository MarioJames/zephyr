import { NextRequest, NextResponse } from 'next/server';
import { clerkBackend } from '@/libs/clerkBackend';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { email, username, fullName } = body;

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必需的' },
        { status: 400 }
      );
    }

    // 准备更新数据
    const updateData: any = {};

    // 如果有邮箱更新
    if (email) {
      updateData.emailAddress = [email];
    }

    // 如果有用户名更新，需要重新编码
    if (username) {
      const clerkUsername = Buffer.from(username, 'utf8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      updateData.username = clerkUsername;
    }

    // 如果有姓名更新
    if (fullName || username) {
      updateData.firstName = fullName || username;
      updateData.lastName = '';
    }

    // 更新 publicMetadata
    const currentUser = await clerkBackend.users.getUser(userId);
    const updatedPublicMetadata = {
      ...currentUser.publicMetadata,
      ...(username && { originalUsername: username, displayName: username }),
      ...(fullName && { originalFullName: fullName }),
    };
    updateData.publicMetadata = updatedPublicMetadata;

    // 在 Clerk 中更新用户
    const updatedUser = await clerkBackend.users.updateUser(userId, updateData);

    return NextResponse.json({
      success: true,
      userId: updatedUser.id,
      message: 'Clerk 用户更新成功'
    });

  } catch (error: any) {
    console.error('Clerk 用户更新失败:', error);

    if (error.clerkError && error.errors) {
      console.error('Clerk 错误详情:', error.errors);
      return NextResponse.json(
        {
          error: 'Clerk 用户更新失败',
          details: error.errors[0]?.message || error.message,
          clerkErrors: error.errors
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Clerk 用户更新失败',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必需的' },
        { status: 400 }
      );
    }

    // 从 Clerk 中删除用户
    await clerkBackend.users.deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: 'Clerk 用户删除成功'
    });

  } catch (error: any) {
    console.error('Clerk 用户删除失败:', error);

    // 如果是 Clerk 错误，返回更详细的信息
    if (error.clerkError && error.errors) {
      console.error('Clerk 错误详情:', error.errors);
      return NextResponse.json(
        {
          error: 'Clerk 用户删除失败',
          details: error.errors[0]?.message || error.message,
          clerkErrors: error.errors
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Clerk 用户删除失败',
        details: error.message
      },
      { status: 500 }
    );
  }
}
