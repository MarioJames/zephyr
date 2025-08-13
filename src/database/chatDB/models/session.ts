import { count } from 'drizzle-orm';
import { and, desc, eq, not } from 'drizzle-orm/expressions';

import { INBOX_SESSION_ID } from '@/const/session';
import {
  genEndDateWhere,
  genRangeWhere,
  genStartDateWhere,
  genWhere,
} from '@/database/utils/genWhere';

import { LobeChatDatabase } from '../type';
import { SessionItem, sessions } from '../schemas';

export class SessionModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.userId = userId;
    this.db = db;
  }
  // **************** Query *************** //

  query = async ({ current = 0, pageSize = 9999 } = {}) => {
    const offset = current * pageSize;

    return this.db.query.sessions.findMany({
      limit: pageSize,
      offset,
      orderBy: [desc(sessions.updatedAt)],
      where: and(
        eq(sessions.userId, this.userId),
        not(eq(sessions.slug, INBOX_SESSION_ID))
      ),
      with: {
        agentsToSessions: { columns: {}, with: { agent: true } },
        group: true,
      },
    });
  };

  count = async (params?: {
    endDate?: string;
    range?: [string, string];
    startDate?: string;
  }): Promise<number> => {
    const result = await this.db
      .select({
        count: count(sessions.id),
      })
      .from(sessions)
      .where(
        genWhere([
          eq(sessions.userId, this.userId),
          params?.range
            ? genRangeWhere(params.range, sessions.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
          params?.endDate
            ? genEndDateWhere(params.endDate, sessions.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
          params?.startDate
            ? genStartDateWhere(params.startDate, sessions.createdAt, (date) =>
                date.toDate()
              )
            : undefined,
        ])
      );

    return result[0].count;
  };

  hasMoreThanN = async (n: number): Promise<boolean> => {
    const result = await this.db
      .select({ id: sessions.id })
      .from(sessions)
      .where(eq(sessions.userId, this.userId))
      .limit(n + 1);

    return result.length > n;
  };

  // **************** Update *************** //

  update = async (id: string, data: Partial<SessionItem>) => {
    return this.db
      .update(sessions)
      .set(data)
      .where(eq(sessions.id, id))
      .returning();
  };
}
