import { NextRequest, NextResponse } from 'next/server';
import { getAdminDB } from '@/database/adminDB';
import { AggregatedModelModel } from '@/database/adminDB/models/aggregatedModel';

/**
 * 获取所有启用的聚合模型
 * curl 'http://localhost:3000/api/aggregated-model'
 */
export async function GET(request: NextRequest) {
  try {
    const db = await getAdminDB();
    const aggregatedModelModel = new AggregatedModelModel(db);

    const enabledModels = await aggregatedModelModel.findEnabled();

    return NextResponse.json({
      success: true,
      data: enabledModels,
      total: enabledModels.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('GET /api/aggregated-model error:', error);
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
