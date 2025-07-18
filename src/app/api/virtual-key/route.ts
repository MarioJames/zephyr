import { NextRequest, NextResponse } from 'next/server';
import { getAdminDB } from '@/database/adminDB';
import { VirtualKeyModel } from '@/database/adminDB/models/virtualKey';

/**
 * GET /api/virtual-key - 获取虚拟KEY
 * userId 和 roleId 参数必传
 *
 * curl 'http://localhost:3000/api/virtual-key?userId=user123&roleId=admin'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const roleId = searchParams.get('roleId');

    // 验证必传参数
    if (!userId || !roleId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'userId 和 roleId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getAdminDB();
    const virtualKeyModel = new VirtualKeyModel(db);

    // 查询指定用户和角色的虚拟KEY
    const virtualKey = await virtualKeyModel.findByUserAndRole(userId, roleId);

    if (!virtualKey) {
      return NextResponse.json(
        {
          success: false,
          error: '虚拟KEY不存在',
          message: `用户 ${userId} 在角色 ${roleId} 下没有配置虚拟KEY`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: virtualKey,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/virtual-key error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取虚拟KEY失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
