/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { integer, pgTable, text } from 'drizzle-orm/pg-core';

import { timestamps } from '@/database/_helpers';

/**
 * admin 中的角色对应的配额信息表
 */
export const roleQuotas = pgTable('role_quotas', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(), // 主键,自增
  roleId: text('role_id').unique().notNull(), // 角色ID，唯一
  tokenBudget: integer('token_budget'), // token 配额
  fileMb: integer('file_mb'), // 文件空间配额(MB)
  vectorCount: integer('vector_count'), // 向量数量配额

  ...timestamps,
});
