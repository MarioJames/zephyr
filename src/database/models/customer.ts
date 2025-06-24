import { and, eq, inArray, like, or, desc, asc } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { LobeChatDatabase } from '@/database/type';

import { CustomerSessionSelect, customerSessions } from '../schemas';

export interface CustomerSessionListParams {
  page?: number;
  pageSize?: number;
  search?: string;
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
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase) {
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
}
