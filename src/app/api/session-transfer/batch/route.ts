import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm/expressions';
import { getChatDB } from '@/database/chatDB';
import { sessions, topics, messages, users } from '@/database/chatDB/schemas';
import { Transaction } from '@/database/chatDB/type';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const addSessionIds: string[] = Array.isArray(body?.addSessionIds)
      ? body.addSessionIds
      : [];
    const removeSessionIds: string[] = Array.isArray(body?.removeSessionIds)
      ? body.removeSessionIds
      : [];
    const newUserId: string | undefined = body?.newUserId;

    if (!Array.isArray(addSessionIds) || !Array.isArray(removeSessionIds)) {
      return NextResponse.json(
        { error: 'addSessionIds and removeSessionIds must be arrays' },
        { status: 400 }
      );
    }

    // 如果两个集合都为空，直接返回成功
    if (addSessionIds.length === 0 && removeSessionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No sessions to transfer',
        data: {
          added: { sessions: [], updatedTopicsCount: 0, updatedMessagesCount: 0, topicIds: [], messageIds: [] },
          removed: { sessions: [], updatedTopicsCount: 0, updatedMessagesCount: 0, topicIds: [], messageIds: [] },
        },
      });
    }

    const db = await getChatDB();

    // add 操作需要 newUserId 校验
    if (addSessionIds.length > 0) {
      if (!newUserId) {
        return NextResponse.json(
          { error: 'newUserId is required when addSessionIds is not empty' },
          { status: 400 }
        );
      }
      const targetUser = await db.query.users.findFirst({ where: eq(users.id, newUserId) });
      if (!targetUser) {
        return NextResponse.json(
          { error: `Target user with id ${newUserId} not found` },
          { status: 404 }
        );
      }
    }

    // 为移除准备占位用户（unassigned）——固定常量
    const UNASSIGNED_USER_ID = 'unassigned';
    if (removeSessionIds.length > 0) {
      const placeholder = await db.query.users.findFirst({ where: eq(users.id, UNASSIGNED_USER_ID) });
      if (!placeholder) {
        // 创建占位用户，最少只需要 id
        await db.insert(users).values({ id: UNASSIGNED_USER_ID, fullName: '未分配' });
      }
    }

    // 校验 union 是否存在
    const unionIds = [...new Set([...addSessionIds, ...removeSessionIds])];
    const foundSessions = await db.query.sessions.findMany({ where: inArray(sessions.id, unionIds) });
    if (foundSessions.length !== unionIds.length) {
      const found = new Set(foundSessions.map((s) => s.id));
      const missing = unionIds.filter((id) => !found.has(id));
      return NextResponse.json(
        { error: `Sessions not found: ${missing.join(', ')}` },
        { status: 404 }
      );
    }

    // 事务中分别处理 add 与 remove
    const result = await db.transaction(async (tx: Transaction) => {
      const res = {
        added: {
          sessions: [] as any[],
          updatedTopicsCount: 0,
          updatedMessagesCount: 0,
          topicIds: [] as string[],
          messageIds: [] as string[],
        },
        removed: {
          sessions: [] as any[],
          updatedTopicsCount: 0,
          updatedMessagesCount: 0,
          topicIds: [] as string[],
          messageIds: [] as string[],
        },
      };

      // ========== 处理分配（add） ==========
      if (addSessionIds.length > 0 && newUserId) {
        const updatedSessions = await tx
          .update(sessions)
          .set({ userId: newUserId })
          .where(inArray(sessions.id, addSessionIds))
          .returning();

        const sessionTopics = await tx
          .select({ id: topics.id })
          .from(topics)
          .where(inArray(topics.sessionId, addSessionIds));
        const topicIds = sessionTopics.map((t: { id: string }) => t.id);

        if (topicIds.length > 0) {
          const updatedTopics = await tx
            .update(topics)
            .set({ userId: newUserId })
            .where(inArray(topics.id, topicIds))
            .returning();
          res.added.updatedTopicsCount = updatedTopics.length;
        }

        let messageIds: string[] = [];
        if (topicIds.length > 0) {
          const sessionMessages = await tx
            .select({ id: messages.id })
            .from(messages)
            .where(inArray(messages.topicId, topicIds));
          messageIds = sessionMessages.map((m: { id: string }) => m.id);
        }
        if (messageIds.length > 0) {
          const updatedMessages = await tx
            .update(messages)
            .set({ userId: newUserId })
            .where(inArray(messages.id, messageIds))
            .returning();
          res.added.updatedMessagesCount = updatedMessages.length;
        }

        res.added.sessions = updatedSessions;
        res.added.topicIds = topicIds;
        res.added.messageIds = messageIds;
      }

      // ========== 处理解除（remove） ==========
      if (removeSessionIds.length > 0) {
        const placeholderId = UNASSIGNED_USER_ID;
        const updatedSessions = await tx
          .update(sessions)
          .set({ userId: placeholderId })
          .where(inArray(sessions.id, removeSessionIds))
          .returning();

        const sessionTopics = await tx
          .select({ id: topics.id })
          .from(topics)
          .where(inArray(topics.sessionId, removeSessionIds));
        const topicIds = sessionTopics.map((t: { id: string }) => t.id);

        if (topicIds.length > 0) {
          const updatedTopics = await tx
            .update(topics)
            .set({ userId: placeholderId })
            .where(inArray(topics.id, topicIds))
            .returning();
          res.removed.updatedTopicsCount = updatedTopics.length;
        }

        let messageIds: string[] = [];
        if (topicIds.length > 0) {
          const sessionMessages = await tx
            .select({ id: messages.id })
            .from(messages)
            .where(inArray(messages.topicId, topicIds));
          messageIds = sessionMessages.map((m: { id: string }) => m.id);
        }
        if (messageIds.length > 0) {
          const updatedMessages = await tx
            .update(messages)
            .set({ userId: placeholderId })
            .where(inArray(messages.id, messageIds))
            .returning();
          res.removed.updatedMessagesCount = updatedMessages.length;
        }

        res.removed.sessions = updatedSessions;
        res.removed.topicIds = topicIds;
        res.removed.messageIds = messageIds;
      }

      return res;
    });

    return NextResponse.json({
      success: true,
      message: 'Batch session transfer completed successfully',
      data: result,
    });
  } catch (error) {
    console.error('Batch session transfer error:', error);
    return NextResponse.json(
      {
        error: 'Failed to transfer sessions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
