import { pgTable, text, integer, jsonb, index } from 'drizzle-orm/pg-core';

export const structuredData = pgTable(
  'structured_data',
  {
    id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    fileId: text('file_id').notNull(),
    data: jsonb('data').notNull(),
  },
  (table) => [index('idx_file_id').on(table.fileId)]
);
