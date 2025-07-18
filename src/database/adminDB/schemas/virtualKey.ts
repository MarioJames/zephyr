/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { index, pgTable, text } from 'drizzle-orm/pg-core';


/**
 * LobeChat 中用户与 LiteLLM 中 Virtual Key 的关联表
 */
export const userVirtualKeys = pgTable(
  'user_virtual_keys',
  {
    userId: text('user_id').notNull(), // 用户ID
    roleId: text('role_id').notNull(), // 角色ID，用于区分不同的角色
    keyVaults: text('key_vaults').notNull(), // 加密存储的 API Key 信息，包含 virtualKeyId 和 virtualKey
  },
  (table) => [
    // user_id 和 role_id 的联合唯一索引，同一个角色下只有一个相同 user_id 的记录
    index('uq_user_id_role_id').on(table.userId, table.roleId),
  ],
);
