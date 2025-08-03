/* eslint-disable sort-keys-fix/sort-keys-fix  */
import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { messageTTS, messageTranslates, messages } from './message';
import { sessionGroups, sessions } from './session';
import { threads, topics } from './topic';
import { users } from './user';

export const agentsToSessions = pgTable(
  'agents_to_sessions',
  {
    sessionId: text('session_id')
      .notNull()
      .references(() => sessions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sessionId] }),
  }),
);

export const topicRelations = relations(topics, ({ one, many }) => ({
  session: one(sessions, {
    fields: [topics.sessionId],
    references: [sessions.id],
  }),
}));

export const threadsRelations = relations(threads, ({ one }) => ({
  sourceMessage: one(messages, {
    fields: [threads.sourceMessageId],
    references: [messages.id],
  }),
}));

export const messagesRelations = relations(messages, ({ many, one }) => ({
  session: one(sessions, {
    fields: [messages.sessionId],
    references: [sessions.id],
  }),

  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),

  parent: one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
  }),

  topic: one(topics, {
    fields: [messages.topicId],
    references: [topics.id],
  }),

  thread: one(threads, {
    fields: [messages.threadId],
    references: [threads.id],
  }),

  translation: one(messageTranslates, {
    fields: [messages.id],
    references: [messageTranslates.id],
  }),

  tts: one(messageTTS, {
    fields: [messages.id],
    references: [messageTTS.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ many, one }) => ({
  agentsToSessions: many(agentsToSessions),
  group: one(sessionGroups, {
    fields: [sessions.groupId],
    references: [sessionGroups.id],
  }),
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const messageTranslatesRelations = relations(messageTranslates, ({ one }) => ({
  message: one(messages, {
    fields: [messageTranslates.id],
    references: [messages.id],
  }),
}));

export const messageTTSRelations = relations(messageTTS, ({ one }) => ({
  message: one(messages, {
    fields: [messageTTS.id],
    references: [messages.id],
  }),
}));