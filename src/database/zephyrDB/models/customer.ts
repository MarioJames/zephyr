import { and, eq, inArray, like, or, desc, asc } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { ZephyrDatabase } from '../type';
import { AgentChatConfig } from '@/types/agent';

import { CustomerSessionItem, customerSessions } from '../schemas';
import { OmitTimestamps } from '@/types';

export interface CustomerSessionListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  agentId?: string;
  userId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'phone' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerSessionParams {
  sessionId: string;
  // 基本信息
  gender?: string;
  age?: number;
  position?: string;
  // 联系方式
  phone?: string;
  email?: string;
  wechat?: string;
  // 公司信息
  company?: string;
  industry?: string;
  scale?: string;
  // 地址信息
  address?: string;
  // 聊天配置
  chatConfig?: AgentChatConfig;
}

export class CustomerModel {
  private db: ZephyrDatabase;

  constructor(db: ZephyrDatabase) {
    this.db = db;
  }

  // 重置序列到当前最大ID + 1
  private resetSequence = async () => {
    await this.db.execute(
      sql`SELECT setval('customer_sessions_id_seq', (SELECT COALESCE(MAX(id) + 1, 1) FROM customer_sessions));`
    );
  };

  // ========== 基础客户会话管理 ==========
  create = async (
    params: OmitTimestamps<CreateCustomerSessionParams>
  ): Promise<number> => {
    const { sessionId, ...customerData } = params;

    // 重置序列
    await this.resetSequence();

    const data = await this.db
      .insert(customerSessions)
      .values({
        sessionId,
        ...customerData,
      })
      .returning();

    return data[0].id;
  };

  update = async (id: number, value: Partial<CustomerSessionItem>) => {
    return this.db
      .update(customerSessions)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(customerSessions.id, id));
  };

  // ========== Session 相关操作 ==========

  findBySessionId = async (
    sessionId: string
  ): Promise<CustomerSessionItem | undefined> => {
    return this.db.query.customerSessions.findFirst({
      where: eq(customerSessions.sessionId, sessionId),
    });
  };

  updateBySessionId = async (
    sessionId: string,
    value: Partial<CustomerSessionItem>
  ) => {
    return this.db
      .update(customerSessions)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(customerSessions.sessionId, sessionId));
  };

  deleteBySessionId = async (sessionId: string) => {
    return this.db
      .delete(customerSessions)
      .where(eq(customerSessions.sessionId, sessionId));
  };

  findBySessionIds = async (
    sessionIds: string[]
  ): Promise<CustomerSessionItem[]> => {
    if (sessionIds.length === 0) return [];

    return this.db.query.customerSessions.findMany({
      where: inArray(customerSessions.sessionId, sessionIds),
    });
  };

  // 根据手机号查找客户
  findByPhone = async (
    phone: string
  ): Promise<CustomerSessionItem | undefined> => {
    if (!phone?.trim()) return undefined;
    
    return this.db.query.customerSessions.findFirst({
      where: eq(customerSessions.phone, phone.trim()),
    });
  };

  count = async (): Promise<number> => {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(customerSessions);

    return Number(result[0]?.count || 0);
  };

  // ========== 列表查询操作 ==========

  list = async (
    params: CustomerSessionListParams
  ): Promise<CustomerSessionItem[]> => {
    const {
      page = 1,
      pageSize = 50,
      keyword,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    // 构建查询条件
    const conditions = [];

    // 添加搜索条件
    if (keyword && keyword.trim()) {
      const searchTerm = `%${keyword.trim()}%`;
      conditions.push(
        or(
          like(customerSessions.company, searchTerm),
          like(customerSessions.phone, searchTerm),
          like(customerSessions.email, searchTerm),
          like(customerSessions.wechat, searchTerm)
        )
      );
    }

    // 构建排序条件
    let orderByClause;
    const sortDirection = sortOrder === 'asc' ? asc : desc;

    switch (sortBy) {
      case 'createdAt': {
        orderByClause = sortDirection(customerSessions.createdAt);
        break;
      }
      case 'updatedAt': {
        orderByClause = sortDirection(customerSessions.updatedAt);
        break;
      }
      case 'phone': {
        orderByClause = sortDirection(customerSessions.phone);
        break;
      }
      case 'company': {
        orderByClause = sortDirection(customerSessions.company);
        break;
      }
      default: {
        orderByClause = desc(customerSessions.createdAt);
      }
    }

    // 构建基础查询 - 使用与count方法相似的语法
    if (conditions.length > 0) {
      return this.db
        .select()
        .from(customerSessions)
        .where(and(...conditions))
        .orderBy(orderByClause)
        .offset((page - 1) * pageSize)
        .limit(pageSize);
    } else {
      return this.db
        .select()
        .from(customerSessions)
        .orderBy(orderByClause)
        .offset((page - 1) * pageSize)
        .limit(pageSize);
    }
  };
}
