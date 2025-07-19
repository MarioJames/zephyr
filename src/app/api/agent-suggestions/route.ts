import { NextRequest, NextResponse } from 'next/server';
import { getZephyrDB } from '@/database/zephyrDB';
import { AgentSuggestionsModel } from '@/database';

/**
 * 获取指定话题的所有建议
 * curl 'http://localhost:3000/api/agent-suggestions?topicId=tpc_432FVbCFRIiP'
 *
 */
export async function GET(request: NextRequest) {
  try {
    const topic = request.nextUrl.searchParams.get('topic');

    console.log('topic', topic);

    if (!topic) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'topic 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getZephyrDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    const suggestions = await agentSuggestionsModel.findByTopicId(topic);

    return NextResponse.json({
      success: true,
      data: suggestions,
      total: suggestions.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: '获取话题建议失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-suggestions - 保存新的建议
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const db = await getZephyrDB();
  const agentSuggestionsModel = new AgentSuggestionsModel(db);

  const newSuggestion = await agentSuggestionsModel.create(body);

  return NextResponse.json({
    data: newSuggestion,
    success: true,
    timestamp: Date.now(),
  });
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

    const db = await getZephyrDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    await agentSuggestionsModel.deleteByTopicId(topicId);

    return NextResponse.json({
      success: true,
      message: '话题建议删除成功',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error(
      'DELETE /api/agent-suggestions/topic/[topicId] error:',
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: '删除话题建议失败',
        message: error instanceof Error ? error.message : '未知错误',
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}
