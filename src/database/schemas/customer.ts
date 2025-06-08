import {
  pgTable,
  varchar,
  timestamp,
  index,
  unique,
  text,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { timestamps } from './_helpers';

// 定义枚举类型
export const genderEnum = pgEnum('gender', ['male', 'female']);

// 客户信息表
export const customers = pgTable('customers', {
  // 主键
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),

  // 客户类型
  customerType: varchar('customerType', { length: 100 }).notNull(),

  // 头像
  avatar: text('avatar'),

  // 基本信息
  name: varchar('name', { length: 100 }).notNull(),
  gender: genderEnum('gender').notNull(),
  age: integer('age').notNull(),
  position: varchar('position', { length: 100 }),

  // 联系方式
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }),
  wechat: varchar('wechat', { length: 50 }),

  // 公司信息
  companyName: varchar('company_name', { length: 200 }).notNull(),
  industry: varchar('industry', { length: 100 }).notNull(),
  scale: varchar('scale', { length: 50 }).notNull(),

  // 地址信息
  province: varchar('province', { length: 50 }).notNull(),
  detailAddress: text('detail_address').notNull(),

  // 备注
  remarks: text('remarks'),

  // 系统字段
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 类型推导
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// 客户 Topic 记录表
export const customerTopics = pgTable(
  'customer_topics',
  {
    // 关联客户ID
    customerId: integer('custom_id').notNull(),

    // Topic 信息
    topicId: varchar('topic_id', { length: 100 }).notNull(), // 外部系统的话题ID

    ...timestamps,
  },
  (table) => ({
    customerIdIdx: index('customer_topics_customer_id_idx').on(
      table.customerId
    ), // 客户ID索引
    topicIdIdx: index('customer_topics_topic_id_idx').on(table.topicId), // 话题ID索引
  })
);

// Drizzle 类型推导
export type CustomerTopicSelect = typeof customerTopics.$inferSelect; // 查询结果类型
export type CustomerTopicInsert = typeof customerTopics.$inferInsert; // 插入数据类型

// 客户与所属员工的关联表
export const customerOwners = pgTable(
  'customer_owners',
  {
    // 客户ID
    customerId: integer('customer_id').notNull(),

    // 所属员工信息
    belongsTo: text('belongs_to').notNull(),

    // 系统字段
    createdAt: timestamp('created_at').defaultNow().notNull(), // 创建时间
  },
  (table) => ({
    customerIdIdx: index('customer_owners_customer_id_idx').on(
      table.customerId
    ), // 客户ID索引
    belongsToIdx: index('customer_owners_owner_id_idx').on(table.belongsTo), // 员工ID索引
    // 确保每个客户只有一条记录
    uniqueCustomer: unique('unique_customer').on(table.customerId),
  })
);

// Drizzle 类型推导
export type CustomerOwnerSelect = typeof customerOwners.$inferSelect; // 查询结果类型
export type CustomerOwnerInsert = typeof customerOwners.$inferInsert; // 插入数据类型
