import { NextRequest, NextResponse } from 'next/server';
import { getZephyrDB } from '@/database/zephyrDB';
import { AgentSuggestionsModel } from '@/database';

/**
 * PUT /api/agent-suggestions/:id - 更新建议
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const { suggestion } = await request.json();

    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'id 必须是数字',
        },
        { status: 400 }
      );
    }

    const db = await getZephyrDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    const updatedSuggestion = await agentSuggestionsModel.update(id, {
      suggestion,
    });

    return NextResponse.json({
      success: true,
      data: updatedSuggestion,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '更新建议失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
} 