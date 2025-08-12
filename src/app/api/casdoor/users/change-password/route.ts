import { NextRequest, NextResponse } from 'next/server';
import { SDK } from 'casdoor-nodejs-sdk';
import { casdoorEnv } from '@/env/casdoor';
import { auth } from '@/libs/auth';

/**
 * POST /api/casdoor/users/change-password
 * 修改 Casdoor 用户密码
 */
export async function POST(request: NextRequest) {
  try {
    // 获取当前会话
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录或会话已过期' },
        { status: 401 }
      );
    }

    // 检查环境变量
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

    const body = await request.json();
    const { oldPassword, newPassword, userInfo } = body;

    // 验证输入
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: '旧密码和新密码不能为空' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为 6 位' },
        { status: 400 }
      );
    }

    let userName = userInfo?.email || userInfo?.name;

    if (!userName) {
      return NextResponse.json(
        { error: '无法获取当前用户信息' },
        { status: 400 }
      );
    }

    try {
      // 验证旧密码
      const casdoorUserName = userInfo?.email || userInfo?.name;

      // 使用Casdoor REST API验证旧密码
      const verifyResponse = await fetch(`${casdoorEnv.CASDOOR_ENDPOINT}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "login",
          organization: casdoorEnv.CASDOOR_ORGANIZATION_NAME,
          username: casdoorUserName,
          password: oldPassword,
          application: casdoorEnv.CASDOOR_APPLICATION_NAME,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok || verifyResult.status === 'error') {
        let errorMessage = '旧密码验证失败';
        if (verifyResult.msg) {
          if (verifyResult.msg.includes('password or code is incorrect')) {
            errorMessage = '旧密码不正确，请检查您输入的密码';
          } else if (verifyResult.msg.includes("doesn't exist")) {
            errorMessage = '用户不存在，请联系管理员';
          } else {
            errorMessage = verifyResult.msg;
          }
        }

        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('旧密码验证失败:', error);
      return NextResponse.json(
        { error: '密码验证过程中发生错误' },
        { status: 400 }
      );
    }

    try {
      // 获取用户详细信息
      const userResponse = await sdk.getUser(userName) as any;
      if (!userResponse || (userResponse.status && userResponse.status === 'error')) {
        return NextResponse.json(
          { error: '无法获取用户信息' },
          { status: 400 }
        );
      }

      // 处理不同的响应格式
      const userData = userResponse.data?.data || userResponse.data || userResponse;

      if (!userData) {
        return NextResponse.json(
          { error: '无法获取用户数据' },
          { status: 404 }
        );
      }

      // 直接使用 Casdoor 的 update-user API
      const updateResponse = await fetch(`${casdoorEnv.CASDOOR_ENDPOINT}/api/update-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${casdoorEnv.CASDOOR_CLIENT_ID}:${casdoorEnv.CASDOOR_CLIENT_SECRET}`).toString('base64')}`,
        },
        body: JSON.stringify({
          ...userData,
          owner: userData.owner || casdoorEnv.CASDOOR_ORGANIZATION_NAME,
          name: userData.name || userName,
          password: newPassword,
        }),
      });

      const updateResult = await updateResponse.json();

      if (!updateResponse.ok || (updateResult.status && updateResult.status === 'error')) {
        return NextResponse.json(
          { error: updateResult.msg || '密码修改失败' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '密码修改成功',
      });

    } catch (error) {
      console.error('密码更新失败:', error);
      return NextResponse.json(
        { error: '密码更新失败' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Casdoor 密码修改失败:', error);

    return NextResponse.json(
      {
        error: error.message || '修改密码时发生内部错误',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
} 