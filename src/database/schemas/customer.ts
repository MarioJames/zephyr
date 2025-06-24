import {
  pgTable,
  varchar,
  index,
  unique,
  text,
  integer,
} from 'drizzle-orm/pg-core';
import { timestamps } from './_helpers';

// 客户 Session 关联信息表
export const customerSessions = pgTable(
  'customer_sessions',
  {
    // 主键
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),

    // 关联字段
    sessionId: text('session_id').notNull().unique(), // 关联外部 session 表的 ID
    customerId: integer('customer_id').notNull(), // 关联本地客户表的 ID

    // Session 表中没有的客户扩展信息
    // 基本信息
    gender: varchar('gender', { length: 10 }), // 性别
    age: integer('age'), // 年龄
    position: varchar('position', { length: 100 }), // 职位
    customerType: varchar('customer_type', { length: 10 }).default('A'), // 客户类型 A/B/C

    // 联系方式
    phone: varchar('phone', { length: 20 }), // 手机号
    email: varchar('email', { length: 255 }), // 邮箱
    wechat: varchar('wechat', { length: 50 }), // 微信号

    // 公司信息
    company: varchar('company', { length: 200 }), // 公司名称
    industry: varchar('industry', { length: 100 }), // 行业
    scale: varchar('scale', { length: 50 }), // 公司规模

    // 地址信息
    province: varchar('province', { length: 50 }), // 省份
    city: varchar('city', { length: 50 }), // 城市
    district: varchar('district', { length: 50 }), // 区县
    address: text('address'), // 详细地址

    // 备注信息
    notes: text('notes'), // 备注

    // 系统字段
    ...timestamps,
  },
  (table) => [
    index('customer_sessions_session_id_idx').on(table.sessionId),
    index('customer_sessions_customer_id_idx').on(table.customerId),
    // 确保每个 session 只有一条客户关联记录
    unique('unique_session').on(table.sessionId),
  ]
);

// Drizzle 类型推导
export type CustomerSessionSelect = typeof customerSessions.$inferSelect;
export type CustomerSessionInsert = typeof customerSessions.$inferInsert;
