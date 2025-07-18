import { pgTable, integer, text, index, jsonb } from 'drizzle-orm/pg-core';
import { timestamps } from '@/database/_helpers';

// AI 智能体建议表
export const agentSuggestions = pgTable(
  'agent_suggestions',
  {
    // 主键
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),

    // 建议内容
    suggestion: jsonb('suggestion').notNull(),

    // 关联的话题 ID
    topicId: text('topic_id').notNull(),

    // 父消息ID
    parentMessageId: text('parent_message_id').notNull(),

    // 系统字段
    ...timestamps,
  },
  (table) => [
    // 为 topicId 创建索引以提高查询性能
    index('agent_suggestions_topic_id_idx').on(table.topicId),
    // 为创建时间创建索引以支持按时间排序
    index('agent_suggestions_created_at_idx').on(table.createdAt),
  ]
);

// Drizzle 类型推导
export type AgentSuggestionSelect = typeof agentSuggestions.$inferSelect;
export type AgentSuggestionInsert = typeof agentSuggestions.$inferInsert;
