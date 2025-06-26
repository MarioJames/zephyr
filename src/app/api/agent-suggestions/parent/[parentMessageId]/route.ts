import { NextRequest, NextResponse } from 'next/server';
import { getServerDB } from '@/database/server';
import { AgentSuggestionsModel } from '@/database/models/agent_suggestions';

/**
 * GET /api/agent-suggestions/parent/[parentMessageId] - 获取指定父消息的建议
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { parentMessageId: string } }
) {
  try {
    const { parentMessageId } = params;

    if (!parentMessageId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'parentMessageId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    const suggestion = await agentSuggestionsModel.findByParentMessageId(parentMessageId);

    return NextResponse.json({
      success: true,
      data: suggestion,
    });
  } catch (error) {
    console.error('GET /api/agent-suggestions/parent/[parentMessageId] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取父消息建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent-suggestions/parent/[parentMessageId] - 删除指定父消息的建议
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { parentMessageId: string } }
) {
  try {
    const { parentMessageId } = params;

    if (!parentMessageId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'parentMessageId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    await agentSuggestionsModel.deleteByParentMessageId(parentMessageId);

    return NextResponse.json({
      success: true,
      message: '父消息建议删除成功',
    });
  } catch (error) {
    console.error('DELETE /api/agent-suggestions/parent/[parentMessageId] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除父消息建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}