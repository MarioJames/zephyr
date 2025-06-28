import { and, eq, inArray, like, or, desc, asc } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { ZephyrDatabase } from '@/database/type';

import { CustomerSessionSelect, customerSessions } from '../schemas';

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
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  // 备注
  notes?: string;
}

export class CustomerModel {
  private db: ZephyrDatabase;

  constructor(db: ZephyrDatabase) {
    this.db = db;
  }

  // ========== 基础客户会话管理 ==========
  create = async (params: CreateCustomerSessionParams): Promise<number> => {
    const { sessionId, ...customerData } = params;

    const data = await this.db
      .insert(customerSessions)
      .values({
        sessionId,
        ...customerData,
      })
      .returning();

    return data[0].id;
  };

  update = async (id: number, value: Partial<CustomerSessionSelect>) => {
    return this.db
      .update(customerSessions)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(customerSessions.id, id));
  };

  // ========== Session 相关操作 ==========

  findBySessionId = async (
    sessionId: string
  ): Promise<CustomerSessionSelect | undefined> => {
    return this.db.query.customerSessions.findFirst({
      where: eq(customerSessions.sessionId, sessionId),
    });
  };

  updateBySessionId = async (
    sessionId: string,
    value: Partial<CustomerSessionSelect>
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
  ): Promise<CustomerSessionSelect[]> => {
    if (sessionIds.length === 0) return [];

    return this.db.query.customerSessions.findMany({
      where: inArray(customerSessions.sessionId, sessionIds),
    });
  };

  count = async (): Promise<number> => {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(customerSessions);
    return result[0]?.count || 0;
  };

  // ========== 列表查询操作 ==========

  list = async (
    params: CustomerSessionListParams
  ): Promise<CustomerSessionSelect[]> => {
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
          like(customerSessions.wechat, searchTerm),
          like(customerSessions.notes, searchTerm)
        )
      );
    }

    // 构建排序条件
    let orderByClause;
    const sortDirection = sortOrder === 'asc' ? asc : desc;

    switch (sortBy) {
      case 'createdAt':
        orderByClause = sortDirection(customerSessions.createdAt);
        break;
      case 'updatedAt':
        orderByClause = sortDirection(customerSessions.updatedAt);
        break;
      case 'phone':
        orderByClause = sortDirection(customerSessions.phone);
        break;
      case 'company':
        orderByClause = sortDirection(customerSessions.company);
        break;
      default:
        orderByClause = desc(customerSessions.createdAt);
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
