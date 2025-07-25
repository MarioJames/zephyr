/* eslint-disable sort-keys-fix/sort-keys-fix  */
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  varchar,
} from 'drizzle-orm/pg-core';

import { timestamps } from '@/database/_helpers';

/**
 * admin 管理的聚合模型
 */
export const AGGREGATED_MODEL = pgTable(
  'aggregated_model',
  {
    id: varchar('id', { length: 150 }).primaryKey().notNull(), // 主键
    logo: text('logo'), // 模型logo
    displayName: varchar('display_name', { length: 200 }), // 模型显示名称
    description: text('description'), // 模型描述
    enabled: boolean('enabled').notNull().default(true), // 是否启用
    type: varchar('type', { length: 20 }).default('chat').notNull(), // 模型类型
    fallbackModelId: text('fallback_model_id'), // Fallback 模型 ID（保留字段）
    pricing: jsonb('pricing').notNull(), // 定价信息（JSON）
    abilities: jsonb('abilities').default({}), // 能力（JSON）
    contextWindowTokens: integer('context_window_tokens'), // 上下文窗口令牌数
    ...timestamps,
  },
  (table) => [index('uq_model_id').on(table.id)] // 模型ID索引
);
