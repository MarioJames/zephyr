import { NextRequest, NextResponse } from 'next/server';
import { getServerDB } from '@/database/server';
import {
  AgentSuggestionsModel,
  CreateAgentSuggestionParams,
  UpdateAgentSuggestionParams,
  AgentSuggestionListParams,
} from '@/database/models/agent_suggestions';

// Agent 建议创建请求类型
export interface AgentSuggestionCreateRequest {
  suggestion: any; // JSON 建议内容
  topicId: string;
  parentMessageId: string;
}

// Agent 建议更新请求类型
export interface AgentSuggestionUpdateRequest extends Partial<AgentSuggestionCreateRequest> {}

/**
 * GET /api/agent-suggestions - 获取建议列表
 * 支持多种查询方式：
 * 1. 通过 topicId 获取话题建议: ?topicId=xxx
 * 2. 通过 parentMessageId 获取特定消息的建议: ?parentMessageId=xxx
 * 3. 分页查询: ?page=1&pageSize=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const parentMessageId = searchParams.get('parentMessageId');
    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const sortBy = searchParams.get('sortBy') as 'createdAt' | 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc';

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    // 如果指定了 parentMessageId，返回单个建议
    if (parentMessageId) {
      const suggestion = await agentSuggestionsModel.findByParentMessageId(parentMessageId);
      
      return NextResponse.json({
        success: true,
        data: suggestion,
      });
    }

    // 如果指定了 topicId 且没有分页参数，返回该话题的所有建议
    if (topicId && !page && !pageSize) {
      const suggestions = await agentSuggestionsModel.findByTopicId(topicId);
      
      return NextResponse.json({
        success: true,
        data: suggestions,
        total: suggestions.length,
      });
    }

    // 分页查询
    const params: AgentSuggestionListParams = {
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 20,
      topicId: topicId || undefined,
      sortBy: sortBy || 'createdAt',
      sortOrder: sortOrder || 'desc',
    };

    const result = await agentSuggestionsModel.findMany(params);

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    });
  } catch (error) {
    console.error('GET /api/agent-suggestions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agent-suggestions - 创建建议
 */
export async function POST(request: NextRequest) {
  try {
    const body: AgentSuggestionCreateRequest = await request.json();

    // 验证必需字段
    if (!body.suggestion || !body.topicId || !body.parentMessageId) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'suggestion、topicId 和 parentMessageId 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    const createParams: CreateAgentSuggestionParams = {
      suggestion: body.suggestion,
      topicId: body.topicId,
      parentMessageId: body.parentMessageId,
    };

    const suggestionId = await agentSuggestionsModel.create(createParams);

    // 获取创建的建议详情
    const createdSuggestion = await agentSuggestionsModel.findById(suggestionId);

    return NextResponse.json({
      success: true,
      data: createdSuggestion,
      message: '建议创建成功',
    });
  } catch (error) {
    console.error('POST /api/agent-suggestions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '创建建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agent-suggestions?id=xxx - 更新建议
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body: AgentSuggestionUpdateRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: 'id 是必需的',
        },
        { status: 400 }
      );
    }

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    // 检查建议是否存在
    const existingSuggestion = await agentSuggestionsModel.findById(Number(id));
    if (!existingSuggestion) {
      return NextResponse.json(
        {
          success: false,
          error: '建议不存在',
        },
        { status: 404 }
      );
    }

    const updateParams: UpdateAgentSuggestionParams = {
      suggestion: body.suggestion,
      topicId: body.topicId,
      parentMessageId: body.parentMessageId,
    };

    await agentSuggestionsModel.update(Number(id), updateParams);

    // 获取更新后的建议详情
    const updatedSuggestion = await agentSuggestionsModel.findById(Number(id));

    return NextResponse.json({
      success: true,
      data: updatedSuggestion,
      message: '建议更新成功',
    });
  } catch (error) {
    console.error('PUT /api/agent-suggestions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '更新建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent-suggestions?id=xxx - 删除建议
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const topicId = searchParams.get('topicId');
    const parentMessageId = searchParams.get('parentMessageId');

    const db = await getServerDB();
    const agentSuggestionsModel = new AgentSuggestionsModel(db);

    // 根据不同参数执行不同的删除操作
    if (id) {
      // 删除单个建议
      const existingSuggestion = await agentSuggestionsModel.findById(Number(id));
      if (!existingSuggestion) {
        return NextResponse.json(
          {
            success: false,
            error: '建议不存在',
          },
          { status: 404 }
        );
      }

      await agentSuggestionsModel.delete(Number(id));
      
      return NextResponse.json({
        success: true,
        message: '建议删除成功',
      });
    } else if (topicId) {
      // 删除话题下所有建议
      await agentSuggestionsModel.deleteByTopicId(topicId);
      
      return NextResponse.json({
        success: true,
        message: '话题建议删除成功',
      });
    } else if (parentMessageId) {
      // 删除特定父消息的建议
      await agentSuggestionsModel.deleteByParentMessageId(parentMessageId);
      
      return NextResponse.json({
        success: true,
        message: '消息建议删除成功',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: '需要提供 id、topicId 或 parentMessageId 中的一个',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('DELETE /api/agent-suggestions error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除建议失败',
        message: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}