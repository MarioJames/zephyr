import { count, sql } from 'drizzle-orm';
import { and, eq, inArray, isNull } from 'drizzle-orm/expressions';

import { LobeChatDatabase } from '@/database/lobeDB/type';
import {
  genEndDateWhere,
  genRangeWhere,
  genStartDateWhere,
  genWhere,
} from '@/database/utils/genWhere';
import { idGenerator } from '@/database/utils/idGenerator';
import { ChatTranslate, UpdateMessageParams } from '@/types/message';
import { merge } from '@/utils/merge';

import {
  MessagePluginItem,
  messagePlugins,
  messageTranslates,
  messages,
} from '../schemas';

export interface QueryMessageParams {
  current?: number;
  pageSize?: number;
  sessionId?: string | null;
  topicId?: string | null;
}

export class MessageModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }

  // **************** Query *************** //

  findById = async (id: string) => {
    return this.db.query.messages.findFirst({
      where: and(eq(messages.id, id), eq(messages.userId, this.userId)),
    });
  };

  count = async (params?: {
    endDate?: string;
    range?: [string, string];
    startDate?: string;
  }): Promise<number> => {
    const result = await this.db
      .select({
        count: count(messages.id),
      })
      .from(messages)
      .where(
        genWhere([
          eq(messages.userId, this.userId),
          params?.range
            ? genRangeWhere(params.range, messages.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
          params?.endDate
            ? genEndDateWhere(params.endDate, messages.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
          params?.startDate
            ? genStartDateWhere(params.startDate, messages.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
        ])
      );

    return result[0].count;
  };

  countWords = async (params?: {
    endDate?: string;
    range?: [string, string];
    startDate?: string;
  }): Promise<number> => {
    const result = await this.db
      .select({
        count: sql<string>`sum(length(${messages.content}))`.as('total_length'),
      })
      .from(messages)
      .where(
        genWhere([
          eq(messages.userId, this.userId),
          params?.range
            ? genRangeWhere(params.range, messages.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
          params?.endDate
            ? genEndDateWhere(params.endDate, messages.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
          params?.startDate
            ? genStartDateWhere(params.startDate, messages.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
        ])
      );

    return Number(result[0].count);
  };

  hasMoreThanN = async (n: number): Promise<boolean> => {
    const result = await this.db
      .select({ id: messages.id })
      .from(messages)
      .where(eq(messages.userId, this.userId))
      .limit(n + 1);

    return result.length > n;
  };

  // **************** Update *************** //

  update = async (id: string, { ...message }: Partial<UpdateMessageParams>) => {
    return this.db.transaction(async (trx) => {
      return trx
        .update(messages)
        .set({
          ...message,
          role: message.role as any,
        })
        .where(and(eq(messages.id, id), eq(messages.userId, this.userId)));
    });
  };

  updatePluginState = async (id: string, state: Record<string, any>) => {
    const item = await this.db.query.messagePlugins.findFirst({
      where: eq(messagePlugins.id, id),
    });
    if (!item) throw new Error('Plugin not found');

    return this.db
      .update(messagePlugins)
      .set({ state: merge(item.state || {}, state) })
      .where(eq(messagePlugins.id, id));
  };

  updateMessagePlugin = async (
    id: string,
    value: Partial<MessagePluginItem>
  ) => {
    const item = await this.db.query.messagePlugins.findFirst({
      where: eq(messagePlugins.id, id),
    });
    if (!item) throw new Error('Plugin not found');

    return this.db
      .update(messagePlugins)
      .set(value)
      .where(eq(messagePlugins.id, id));
  };

  updateTranslate = async (id: string, translate: Partial<ChatTranslate>) => {
    const result = await this.db.query.messageTranslates.findFirst({
      where: and(eq(messageTranslates.id, id)),
    });

    // If the message does not exist in the translate table, insert it
    if (!result) {
      return this.db
        .insert(messageTranslates)
        .values({ ...translate, id, userId: this.userId });
    }

    // or just update the existing one
    return this.db
      .update(messageTranslates)
      .set(translate)
      .where(eq(messageTranslates.id, id));
  };

  // **************** Delete *************** //

  deleteMessage = async (id: string) => {
    return this.db.transaction(async (tx) => {
      // 1. 查询要删除的 message 的完整信息
      const message = await tx
        .select()
        .from(messages)
        .where(and(eq(messages.id, id), eq(messages.userId, this.userId)))
        .limit(1);

      // 如果找不到要删除的 message,直接返回
      if (message.length === 0) return;

      // 删除所有相关的 message
      await tx.delete(messages).where(inArray(messages.id, [id]));
    });
  };

  deleteMessages = async (ids: string[]) =>
    this.db
      .delete(messages)
      .where(and(eq(messages.userId, this.userId), inArray(messages.id, ids)));

  deleteMessageTranslate = async (id: string) =>
    this.db
      .delete(messageTranslates)
      .where(
        and(
          eq(messageTranslates.id, id),
          eq(messageTranslates.userId, this.userId)
        )
      );

  deleteMessagesBySession = async (
    sessionId?: string | null,
    topicId?: string | null
  ) =>
    this.db
      .delete(messages)
      .where(
        and(
          eq(messages.userId, this.userId),
          this.matchSession(sessionId),
          this.matchTopic(topicId)
        )
      );

  deleteAllMessages = async () => {
    return this.db.delete(messages).where(eq(messages.userId, this.userId));
  };

  // **************** Helper *************** //

  private genId = () => idGenerator('messages', 14);

  private matchSession = (sessionId?: string | null) =>
    sessionId ? eq(messages.sessionId, sessionId) : isNull(messages.sessionId);

  private matchTopic = (topicId?: string | null) =>
    topicId ? eq(messages.topicId, topicId) : isNull(messages.topicId);
}
