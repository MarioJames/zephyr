import { NextRequest, NextResponse } from 'next/server';
import { SDK } from 'casdoor-nodejs-sdk';
import { casdoorEnv } from '@/env/casdoor';
import { User } from 'casdoor-nodejs-sdk/lib/cjs/user';

/**
 * PUT /api/casdoor/users/[id]
 * 更新 Casdoor 用户
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (
      !casdoorEnv.CASDOOR_ENDPOINT ||
      !casdoorEnv.CASDOOR_CLIENT_ID ||
      !casdoorEnv.CASDOOR_CLIENT_SECRET ||
      !casdoorEnv.CASDOOR_CERTIFICATE ||
      !casdoorEnv.CASDOOR_ORGANIZATION_NAME
    ) {
      return NextResponse.json(
        { error: 'Casdoor 环境变量未配置' },
        { status: 500 }
      );
    }

    const sdk = new SDK({
      endpoint: casdoorEnv.CASDOOR_ENDPOINT,
      clientId: casdoorEnv.CASDOOR_CLIENT_ID,
      clientSecret: casdoorEnv.CASDOOR_CLIENT_SECRET,
      certificate: casdoorEnv.CASDOOR_CERTIFICATE,
      orgName: casdoorEnv.CASDOOR_ORGANIZATION_NAME,
    });

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 });
    }

    const body = await request.json();

    // 先获取现有用户信息
    const existingUser = await sdk.getUser(userId);
    if (!existingUser || !existingUser.data) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const existingUserData = existingUser.data.data;

    // 合并用户数据，保持关键字段不变
    const updatedUserData = {
      ...existingUserData,
      name: body.displayName || existingUserData.name,
      email: body.email || existingUserData.email,
      phone: body.phone || existingUserData.phone,
      avatar: body.avatar !== undefined ? body.avatar : existingUserData.avatar,
      firstName:
        body.firstName !== undefined
          ? body.firstName
          : existingUserData.firstName,
      lastName:
        body.lastName !== undefined ? body.lastName : existingUserData.lastName,
      updatedTime: new Date().toISOString(),
    };

    const result = await sdk.updateUser(updatedUserData);

    return NextResponse.json({
      success: true,
      data: result.data,
      message: '用户更新成功',
    });
  } catch (error: any) {
    console.error('Casdoor 用户更新失败:', error);

    return NextResponse.json(
      {
        error: error.message || '更新用户时发生内部错误',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/casdoor/users/[id]
 * 删除 Casdoor 用户
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (
      !casdoorEnv.CASDOOR_ENDPOINT ||
      !casdoorEnv.CASDOOR_CLIENT_ID ||
      !casdoorEnv.CASDOOR_CLIENT_SECRET ||
      !casdoorEnv.CASDOOR_CERTIFICATE ||
      !casdoorEnv.CASDOOR_ORGANIZATION_NAME
    ) {
      return NextResponse.json(
        { error: 'Casdoor 环境变量未配置' },
        { status: 500 }
      );
    }

    const sdk = new SDK({
      endpoint: casdoorEnv.CASDOOR_ENDPOINT,
      clientId: casdoorEnv.CASDOOR_CLIENT_ID,
      clientSecret: casdoorEnv.CASDOOR_CLIENT_SECRET,
      certificate: casdoorEnv.CASDOOR_CERTIFICATE,
      orgName: casdoorEnv.CASDOOR_ORGANIZATION_NAME,
    });

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json({ error: '用户ID是必需的' }, { status: 400 });
    }

    // 构建删除用户的参数
    const userToDelete = {
      name: userId,
      owner: casdoorEnv.CASDOOR_ORGANIZATION_NAME,
    };

    const result = await sdk.deleteUser(userToDelete as User);

    return NextResponse.json({
      success: true,
      data: result.data,
      message: '用户删除成功',
    });
  } catch (error: any) {
    console.error('Casdoor 用户删除失败:', error);

    return NextResponse.json(
      {
        error: error.message || '删除用户时发生内部错误',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
