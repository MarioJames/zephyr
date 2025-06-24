import { and, eq, inArray, like, or, desc, asc } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { LobeChatDatabase } from '@/database/type';

import {
  CustomerSessionSelect,
  CustomerSessionInsert,
  customerSessions,
} from '../schemas';

export interface CustomerSessionListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  customerType?: 'A' | 'B' | 'C';
  sortBy?: 'createdAt' | 'updatedAt' | 'phone' | 'company';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerSessionParams {
  sessionId: string;
  customerId?: number;
  // 基本信息
  gender?: string;
  age?: number;
  position?: string;
  customerType?: 'A' | 'B' | 'C';
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
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  // ========== 基础客户会话管理 ==========

  create = async (params: CreateCustomerSessionParams): Promise<number> => {
    const { sessionId, customerId = 0, ...customerData } = params;

    const data = await this.db
      .insert(customerSessions)
      .values({
        sessionId,
        customerId,
        ...customerData,
      })
      .returning();

    return data[0].id;
  };

  delete = async (id: number) => {
    return this.db.delete(customerSessions).where(eq(customerSessions.id, id));
  };

  findById = async (id: number): Promise<CustomerSessionSelect | undefined> => {
    return this.db.query.customerSessions.findFirst({ 
      where: eq(customerSessions.id, id) 
    });
  };

  update = async (id: number, value: Partial<CustomerSessionSelect>) => {
    return this.db
      .update(customerSessions)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(customerSessions.id, id));
  };

  findByIds = async (ids: number[]): Promise<CustomerSessionSelect[]> => {
    if (ids.length === 0) return [];
    
    return this.db.query.customerSessions.findMany({
      where: inArray(customerSessions.id, ids),
    });
  };

  // ========== Session 相关操作 ==========

  findBySessionId = async (sessionId: string): Promise<CustomerSessionSelect | undefined> => {
    return this.db.query.customerSessions.findFirst({
      where: eq(customerSessions.sessionId, sessionId),
    });
  };

  updateBySessionId = async (sessionId: string, value: Partial<CustomerSessionSelect>) => {
    return this.db
      .update(customerSessions)
      .set({ ...value, updatedAt: new Date() })
      .where(eq(customerSessions.sessionId, sessionId));
  };

  deleteBySessionId = async (sessionId: string) => {
    return this.db.delete(customerSessions).where(eq(customerSessions.sessionId, sessionId));
  };

  findBySessionIds = async (sessionIds: string[]): Promise<CustomerSessionSelect[]> => {
    if (sessionIds.length === 0) return [];
    
    return this.db.query.customerSessions.findMany({
      where: inArray(customerSessions.sessionId, sessionIds),
    });
  };

  // ========== 客户信息查询 ==========

  list = async (params: CustomerSessionListParams = {}): Promise<{
    data: CustomerSessionSelect[];
    total: number;
  }> => {
    const {
      page = 1,
      pageSize = 10,
      search,
      customerType,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    // 构建查询条件
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(customerSessions.phone, `%${search}%`),
          like(customerSessions.email, `%${search}%`),
          like(customerSessions.company, `%${search}%`),
          like(customerSessions.position, `%${search}%`)
        )
      );
    }

    if (customerType) {
      conditions.push(eq(customerSessions.customerType, customerType));
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // 排序条件
    const orderBy = sortOrder === 'desc' 
      ? desc(customerSessions[sortBy]) 
      : asc(customerSessions[sortBy]);

    // 查询数据
    const data = await this.db.query.customerSessions.findMany({
      where: whereCondition,
      orderBy,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    // 查询总数
    const totalResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(customerSessions)
      .where(whereCondition);

    const total = totalResult[0]?.count || 0;

    return { data, total };
  };

  // ========== 业务查询方法 ==========

  findByPhone = async (phone: string): Promise<CustomerSessionSelect | undefined> => {
    return this.db.query.customerSessions.findFirst({
      where: eq(customerSessions.phone, phone),
    });
  };

  findByEmail = async (email: string): Promise<CustomerSessionSelect | undefined> => {
    return this.db.query.customerSessions.findFirst({
      where: eq(customerSessions.email, email),
    });
  };

  findByCustomerId = async (customerId: number): Promise<CustomerSessionSelect[]> => {
    return this.db.query.customerSessions.findMany({
      where: eq(customerSessions.customerId, customerId),
    });
  };

  // ========== 统计方法 ==========

  getCustomerStats = async (): Promise<{
    total: number;
    typeA: number;
    typeB: number;
    typeC: number;
  }> => {
    const stats = await this.db
      .select({
        customerType: customerSessions.customerType,
        count: sql<number>`count(*)`,
      })
      .from(customerSessions)
      .groupBy(customerSessions.customerType);

    const result = {
      total: 0,
      typeA: 0,
      typeB: 0,
      typeC: 0,
    };

    stats.forEach((stat) => {
      result.total += stat.count;
      if (stat.customerType === 'A') result.typeA = stat.count;
      else if (stat.customerType === 'B') result.typeB = stat.count;
      else if (stat.customerType === 'C') result.typeC = stat.count;
    });

    return result;
  };

  // 获取最近更新的客户会话
  getRecentCustomerSessions = async (limit: number = 10): Promise<CustomerSessionSelect[]> => {
    return this.db.query.customerSessions.findMany({
      orderBy: desc(customerSessions.updatedAt),
      limit,
    });
  };

  // 根据公司查找客户会话
  findByCompany = async (company: string): Promise<CustomerSessionSelect[]> => {
    return this.db.query.customerSessions.findMany({
      where: like(customerSessions.company, `%${company}%`),
    });
  };

  // 根据行业查找客户会话
  findByIndustry = async (industry: string): Promise<CustomerSessionSelect[]> => {
    return this.db.query.customerSessions.findMany({
      where: eq(customerSessions.industry, industry),
    });
  };

  // 根据地区查找客户会话
  findByRegion = async (province?: string, city?: string): Promise<CustomerSessionSelect[]> => {
    const conditions = [];
    
    if (province) {
      conditions.push(eq(customerSessions.province, province));
    }
    
    if (city) {
      conditions.push(eq(customerSessions.city, city));
    }

    if (conditions.length === 0) return [];

    return this.db.query.customerSessions.findMany({
      where: and(...conditions),
    });
  };

  // 批量更新客户类型
  batchUpdateCustomerType = async (ids: number[], customerType: 'A' | 'B' | 'C') => {
    if (ids.length === 0) return;

    return this.db
      .update(customerSessions)
      .set({ customerType, updatedAt: new Date() })
      .where(inArray(customerSessions.id, ids));
  };
}