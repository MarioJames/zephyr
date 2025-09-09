import {
  pgTable,
  varchar,
  index,
  unique,
  text,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { timestamps } from '@/database/_helpers';

// 客户 Session 关联信息表
export const customerSessions = pgTable(
  'customer_sessions',
  {
    // 主键
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),

    // 关联字段
    sessionId: text('session_id').notNull().unique(), // 关联外部 session 表的 ID

    // Session 表中没有的客户扩展信息
    gender: varchar('gender', { length: 10 }), // 性别
    age: integer('age'), // 年龄
    work: text('work'), // 工作
    maritalStatus: varchar('marital_status', { length: 20 }), // 婚姻状况：Married / Unmarried
    familySituation: text('family_situation'), // 家庭情况
    hobby: text('hobby'), // 兴趣爱好

    // 聊天配置
    chatConfig: jsonb('chat_config'), // 聊天相关配置，可存储 JSON 数据

    // 系统字段
    ...timestamps,
  },
  (table) => [
    index('customer_sessions_session_id_idx').on(table.sessionId),
    // 确保每个 session 只有一条客户关联记录
    unique('unique_session').on(table.sessionId),
  ]
);

// Drizzle 类型推导
export type CustomerSessionItem = typeof customerSessions.$inferSelect;
export type CustomerSessionInsert = typeof customerSessions.$inferInsert;
