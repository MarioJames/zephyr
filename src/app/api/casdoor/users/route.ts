import { NextRequest, NextResponse } from 'next/server';
import { SDK } from 'casdoor-nodejs-sdk';
import { casdoorEnv } from '@/env/casdoor';

/**
 * POST /api/casdoor/users
 * 创建 Casdoor 用户
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const user = await sdk.addUser({
      name: body.name,
      displayName: body.name,
      email: body.email,
      phone: body.phone,
      owner: 'built-in',
      createdTime: new Date().toISOString(),
      avatar: body.avatar || '',
      password: 'zephyr.default',
    });

    if ((user.status as unknown as string) === 'error') {
      return NextResponse.json({
        error: (user.msg as unknown as string) || '创建用户失败',
        status: 400,
      });
    }

    return NextResponse.json({
      success: true,
      data: user.data,
      message: '用户创建成功',
    });
  } catch (error: any) {
    console.error('Casdoor 用户创建失败:', error);

    return NextResponse.json(
      {
        error: error.message || '创建用户时发生内部错误',
        details:
          process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
