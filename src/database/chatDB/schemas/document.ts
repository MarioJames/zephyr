import {
  pgTable,
  text,
  integer,
  jsonb,
  index,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { files } from './file';
import { users } from './user';
import { LobeDocumentPage } from '@/types/document';
import { timestamps } from './_helpers';

/**
 * 文档表 - 存储文件内容或网页搜索结果
 */
export const documents = pgTable(
  'documents',
  {
    id: varchar('id', { length: 30 }).primaryKey(),

    // 基本信息
    title: text('title'),
    content: text('content'),
    fileType: varchar('file_type', { length: 255 }).notNull(),
    filename: text('filename'),

    // 统计信息
    totalCharCount: integer('total_char_count').notNull(),
    totalLineCount: integer('total_line_count').notNull(),

    // 元数据
    metadata: jsonb('metadata').$type<Record<string, any>>(),

    // 页面/块数据
    pages: jsonb('pages').$type<LobeDocumentPage[]>(),

    // 来源类型
    sourceType: text('source_type', { enum: ['file', 'web', 'api'] }).notNull(),
    source: text('source').notNull(), // 文件路径或网页URL

    // 关联文件（可选）
    fileId: text('file_id').references(() => files.id, {
      onDelete: 'set null',
    }),

    // 用户关联
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    clientId: text('client_id'),

    // 时间戳
    ...timestamps,
  },
  (table) => [
    index('documents_source_idx').on(table.source),
    index('documents_file_type_idx').on(table.fileType),
    index('documents_file_id_idx').on(table.fileId),
    uniqueIndex('documents_client_id_user_id_unique').on(
      table.clientId,
      table.userId
    ),
  ]
);
