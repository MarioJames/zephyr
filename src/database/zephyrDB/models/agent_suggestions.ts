import { and, eq, inArray, like, or, desc, asc } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { ZephyrDatabase } from '../type';

import { AgentSuggestionSelect, agentSuggestions } from '../schemas';
import { AgentSuggestionContent } from '@/services/agent_suggestions';

export interface AgentSuggestionListParams {
  page?: number;
  pageSize?: number;
  topicId?: string;
  parentMessageId?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAgentSuggestionParams {
  suggestion: AgentSuggestionContent; // JSON 建议内容
  topicId: string;
  parentMessageId: string;
}

export interface UpdateAgentSuggestionParams {
  suggestion?: any;
  topicId?: string;
  parentMessageId?: string;
}

export class AgentSuggestionsModel {
  private db: ZephyrDatabase;

  constructor(db: ZephyrDatabase) {
    this.db = db;
  }

  // ========== 基础 CRUD 操作 ==========

  /**
   * 创建建议记录
   */
  create = async (params: CreateAgentSuggestionParams): Promise<AgentSuggestionSelect> => {
    // 重置序列到当前最大ID + 1，确保新记录不会冲突
    await this.db.execute(sql`SELECT setval('agent_suggestions_id_seq', (SELECT COALESCE(MAX(id) + 1, 1) FROM agent_suggestions));`);
    
    const data = await this.db
      .insert(agentSuggestions)
      .values({
        suggestion: params.suggestion,
        topicId: params.topicId,
        parentMessageId: params.parentMessageId,
      })
      .returning();

    return data[0];
  };

  /**
   * 根据ID获取建议
   */
  findById = async (id: number): Promise<AgentSuggestionSelect | undefined> => {
    return this.db.query.agentSuggestions.findFirst({
      where: eq(agentSuggestions.id, id),
    });
  };

  /**
   * 更新建议记录
   */
  update = async (id: number, params: UpdateAgentSuggestionParams) => {
    return this.db
      .update(agentSuggestions)
      .set({ ...params, updatedAt: new Date() })
      .where(eq(agentSuggestions.id, id));
  };

  /**
   * 删除建议记录
   */
  delete = async (id: number) => {
    return this.db
      .delete(agentSuggestions)
      .where(eq(agentSuggestions.id, id));
  };

  // ========== 查询操作 ==========

  /**
   * 根据话题ID获取建议列表
   */
  findByTopicId = async (topicId: string): Promise<AgentSuggestionSelect[]> => {
    return this.db.query.agentSuggestions.findMany({
      where: eq(agentSuggestions.topicId, topicId),
      orderBy: [asc(agentSuggestions.createdAt)],
    });
  };

  /**
   * 根据父消息ID获取建议
   */
  findByParentMessageId = async (
    parentMessageId: string
  ): Promise<AgentSuggestionSelect | undefined> => {
    return this.db.query.agentSuggestions.findFirst({
      where: eq(agentSuggestions.parentMessageId, parentMessageId),
    });
  };

  /**
   * 根据话题ID列表批量获取建议
   */
  findByTopicIds = async (
    topicIds: string[]
  ): Promise<AgentSuggestionSelect[]> => {
    if (topicIds.length === 0) return [];

    return this.db.query.agentSuggestions.findMany({
      where: inArray(agentSuggestions.topicId, topicIds),
      orderBy: [desc(agentSuggestions.createdAt)],
    });
  };

  /**
   * 根据父消息ID列表批量获取建议
   */
  findByParentMessageIds = async (
    parentMessageIds: string[]
  ): Promise<AgentSuggestionSelect[]> => {
    if (parentMessageIds.length === 0) return [];

    return this.db.query.agentSuggestions.findMany({
      where: inArray(agentSuggestions.parentMessageId, parentMessageIds),
      orderBy: [desc(agentSuggestions.createdAt)],
    });
  };

  /**
   * 分页查询建议列表
   */
  findMany = async (params: AgentSuggestionListParams = {}): Promise<{
    data: AgentSuggestionSelect[];
    total: number;
    page: number;
    pageSize: number;
  }> => {
    const {
      page = 1,
      pageSize = 20,
      topicId,
      parentMessageId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    // 构建 where 条件
    const conditions = [];
    if (topicId) {
      conditions.push(eq(agentSuggestions.topicId, topicId));
    }
    if (parentMessageId) {
      conditions.push(eq(agentSuggestions.parentMessageId, parentMessageId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // 构建排序
    const orderByClause = sortOrder === 'desc'
      ? desc(agentSuggestions[sortBy])
      : asc(agentSuggestions[sortBy]);

    // 查询总数
    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(agentSuggestions)
      .where(whereClause);

    const total = countResult[0]?.count || 0;

    // 查询数据
    const data = await this.db.query.agentSuggestions.findMany({
      where: whereClause,
      orderBy: [orderByClause],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
    };
  };

  /**
   * 获取建议总数
   */
  count = async (params: { topicId?: string; parentMessageId?: string } = {}): Promise<number> => {
    const { topicId, parentMessageId } = params;

    // 构建 where 条件
    const conditions = [];
    if (topicId) {
      conditions.push(eq(agentSuggestions.topicId, topicId));
    }
    if (parentMessageId) {
      conditions.push(eq(agentSuggestions.parentMessageId, parentMessageId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(agentSuggestions)
      .where(whereClause);

    return result[0]?.count || 0;
  };

  /**
   * 根据话题ID删除所有相关建议
   */
  deleteByTopicId = async (topicId: string) => {
    return this.db
      .delete(agentSuggestions)
      .where(eq(agentSuggestions.topicId, topicId));
  };

  /**
   * 根据父消息ID删除建议
   */
  deleteByParentMessageId = async (parentMessageId: string) => {
    return this.db
      .delete(agentSuggestions)
      .where(eq(agentSuggestions.parentMessageId, parentMessageId));
  };
}
