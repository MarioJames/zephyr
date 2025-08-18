import { NextRequest, NextResponse } from 'next/server';
import litellmService from '@/services/litellm';
import { QuotaModel } from '@/database/adminDB/models/quota';
import { VirtualKeyModel } from '@/database/adminDB/models/virtualKey';
import { getAdminDB } from '@/database/adminDB';

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

    // 2. 获取角色对应的 token 限额
    const adminDB = await getAdminDB();
    const quotaModel = new QuotaModel(adminDB);
    const quota = await quotaModel.findByRoleId(roleId);

    const tokenBudget = quota?.tokenBudget || 0;

    // 3. 创建虚拟 KEY
    const virtualKeyResult = await litellmService.createVirtualKey(
      userId,
      roleId,
      tokenBudget
    );

    // 4. 将虚拟 KEY 信息保存到数据库
    const virtualKeyModel = new VirtualKeyModel(adminDB);
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
