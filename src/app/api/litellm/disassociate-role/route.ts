import { NextRequest, NextResponse } from 'next/server';
import litellmService from '@/services/litellm';
import { VirtualKeyModel } from '@/database/adminDB/models/virtualKey';
import { getAdminDB } from '@/database/adminDB';
import { VirtualKeyResponse } from '@/services/user';

interface DisassociateRoleRequest {
  userId: string;
  roleId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DisassociateRoleRequest = await request.json();
    const { userId, roleId } = body;

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: '缺少必要参数 userId 或 roleId' },
        { status: 400 }
      );
    }

    // 1. 获取用户的虚拟 KEY 信息
    const adminDB = await getAdminDB();
    const virtualKeyModel = new VirtualKeyModel(adminDB);
    const virtualKeyInfo = (await virtualKeyModel.findByUserAndRole(
      userId,
      roleId
    )) as VirtualKeyResponse;

    if (virtualKeyInfo) {
      // 2. 阻止虚拟 KEY（如果存在）
      const virtualKeyId = virtualKeyInfo.keyVaults.virtualKeyId;
      if (virtualKeyId) {
        await litellmService.blockVirtualKey(virtualKeyId);
      }
    }

    // 3. 从团队中删除用户
    await litellmService.deleteTeamUser(userId, roleId);

    return NextResponse.json({
      success: true,
      message: '角色取消关联成功',
    });
  } catch (error) {
    console.error('取消角色关联失败:', error);

    return NextResponse.json(
      {
        error: '取消角色关联失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
