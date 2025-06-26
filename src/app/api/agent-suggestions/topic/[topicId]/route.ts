import { NextRequest, NextResponse } from 'next/server';
import { getServerDB } from '@/database/server';
import { AgentSuggestionsModel } from '@/database/models/agent_suggestions';

/**
 * GET /api/agent-suggestions/topic/[topicId] - 获取指定话题的所有建议
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const { topicId } = params;

    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'topicId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    const suggestions = await agentSuggestionsModel.findByTopicId(topicId);

    return NextResponse.json({
      success: true,
      data: suggestions,
      total: suggestions.length,
    });
  } catch (error) {
    console.error('GET /api/agent-suggestions/topic/[topicId] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取话题建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent-suggestions/topic/[topicId] - 删除指定话题的所有建议
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { topicId: string } }
) {
  try {
    const { topicId } = params;

    if (!topicId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'topicId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    await agentSuggestionsModel.deleteByTopicId(topicId);

    return NextResponse.json({
      success: true,
      message: '话题建议删除成功',
    });
  } catch (error) {
    console.error('DELETE /api/agent-suggestions/topic/[topicId] error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除话题建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}