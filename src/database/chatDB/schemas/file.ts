import {
  pgTable,
  text,
  integer,
  jsonb,
  index,
  uniqueIndex,
  varchar,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './user';
import { asyncTasks } from './asyncTask';
import { createdAt, accessedAt, timestamps } from './_helpers';

export enum FileSource {
  ImageGeneration = 'image_generation',
}

export const globalFiles = pgTable('global_files', {
  hashId: varchar('hash_id', { length: 64 }).primaryKey(),
  fileType: varchar('file_type', { length: 255 }).notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  metadata: jsonb('metadata'),
  creator: text('creator')
    .references(() => users.id, { onDelete: 'set null' })
    .notNull(),
  createdAt: createdAt(),
  accessedAt: accessedAt(),
});

export const files = pgTable(
  'files',
  {
    id: text('id').primaryKey(),

    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    /**
     * mime
     */
    fileType: varchar('file_type', { length: 255 }).notNull(),
    /**
     * sha256
     */
    fileHash: varchar('file_hash', { length: 64 }).references(
      () => globalFiles.hashId,
      {
        onDelete: 'no action',
      }
    ),
    name: text('name').notNull(),
    size: integer('size').notNull(),
    url: text('url').notNull(),
    source: text('source').$type<FileSource>(),

    clientId: text('client_id'),
    metadata: jsonb('metadata'),
    chunkTaskId: uuid('chunk_task_id').references(() => asyncTasks.id, {
      onDelete: 'set null',
    }),
    embeddingTaskId: uuid('embedding_task_id').references(() => asyncTasks.id, {
      onDelete: 'set null',
    }),

    ...timestamps,
  },
  (table) => {
    return {
      fileHashIdx: index('file_hash_idx').on(table.fileHash),
      clientIdUnique: uniqueIndex('files_client_id_user_id_unique').on(
        table.clientId,
        table.userId
      ),
    };
  }
);
