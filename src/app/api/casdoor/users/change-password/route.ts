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

    const userName = userInfo?.name;


    if (!userName) {
      return NextResponse.json(
        { error: '无法获取当前用户信息' },
        { status: 400 }
      );
    }

    try {
      // 使用 Casdoor SDK 的 setPassword 方法
      const setPasswordData = {
        owner: casdoorEnv.CASDOOR_ORGANIZATION_NAME,
        name: userName,
        newPassword: newPassword,
        oldPassword: oldPassword,
      };

      const result = await sdk.setPassword(setPasswordData);

      // 检查结果
      if (result?.data && result?.data?.status === 'error') {
        return NextResponse.json(
          { error: result?.data?.msg || '密码修改失败' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '密码修改成功',
      });

    } catch (error: any) {
      console.error('密码修改失败:', error);
      
      // 处理常见的错误情况
      let errorMessage = '密码修改失败';
      if (error.response?.data?.msg) {
        errorMessage = error?.response?.data?.msg;
      } else if (error.message) {
        if (error?.message?.includes('User does not exist')) {
          errorMessage = '用户不存在，请联系管理员';
        } else if (error?.message?.includes('permission denied')) {
          errorMessage = '权限不足，无法修改密码';
        } else {
          errorMessage = error.message;
        }
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
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