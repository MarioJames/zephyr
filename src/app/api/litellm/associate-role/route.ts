import { NextRequest, NextResponse } from 'next/server';
import litellmService from '@/services/litellm';
import { QuotaModel } from '@/database/adminDB/models/quota';
import { VirtualKeyModel } from '@/database/adminDB/models/virtualKey';
import { getAdminDB } from '@/database/adminDB';
import { VirtualKeyResponse } from '@/services/user';

interface AssociateRoleRequest {
  userId: string;
  roleId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AssociateRoleRequest = await request.json();
    const { userId, roleId } = body;

    if (!userId || !roleId) {
      return NextResponse.json(
        { error: '缺少必要参数 userId 或 roleId' },
        { status: 400 }
      );
    }

    // 1. 创建 LiteLLM 团队用户
    await litellmService.createTeamUser(userId, roleId);

    const adminDB = await getAdminDB();

    // 1. 查看有没有之前创建的虚拟Key
    const virtualKeyModel = new VirtualKeyModel(adminDB);
    const virtualKeyInfo = (await virtualKeyModel.findByUserAndRole(
      userId,
      roleId
    )) as VirtualKeyResponse;

    if (virtualKeyInfo) {
      // 如果存在，则激活虚拟Key
      await litellmService.activateVirtualKey(
        virtualKeyInfo.keyVaults.virtualKeyId
      );

      return NextResponse.json({
        success: true,
        message: '角色关联成功',
      });
    }

    // 2. 之前没有创建过虚拟Key，则进入创建流程
    // 2.1 获取角色对应的 token 限额
    const quotaModel = new QuotaModel(adminDB);
    const quota = await quotaModel.findByRoleId(roleId);

    // 2.2 创建虚拟 KEY
    const virtualKeyResult = await litellmService.createVirtualKey(
      userId,
      roleId,
      quota?.tokenBudget
    );

    // 2.3 将虚拟 KEY 信息保存到数据库
    await virtualKeyModel.create(userId, roleId, {
      virtualKeyId: virtualKeyResult.token_id,
      virtualKey: virtualKeyResult.key,
    });

    return NextResponse.json({
      success: true,
      message: '角色关联成功',
    });
  } catch (error) {
    console.error('关联角色失败:', error);

    return NextResponse.json(
      {
        error: '关联角色失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
