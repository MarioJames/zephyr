import { NextRequest, NextResponse } from 'next/server';
import { getAdminDB } from '@/database/adminDB';
import { AggregatedModelModel } from '@/database/adminDB/models/aggregatedModel';

/**
 * 根据ID获取聚合模型
 * curl 'http://localhost:3000/api/aggregated-model/123'
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = await getAdminDB();
    const aggregatedModelModel = new AggregatedModelModel(db);

    const model = await aggregatedModelModel.findById(id);
    if (!model) {
      return NextResponse.json(
        {
          success: false,
          error: '模型不存在',
          message: `未找到 ID 为 ${id} 的模型`,
          timestamp: Date.now(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: model,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/aggregated-model/[id] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取聚合模型失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
} 