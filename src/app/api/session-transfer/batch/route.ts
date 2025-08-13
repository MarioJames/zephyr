import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm/expressions';
import { getChatDB } from '@/database/chatDB';
import { sessions, topics, messages, users } from '@/database/chatDB/schemas';
import { Transaction } from '@/database/chatDB/type';

export async function POST(request: NextRequest) {
  try {
    const { sessionIds, newUserId } = await request.json();

    if (
      !sessionIds ||
      !Array.isArray(sessionIds) ||
      sessionIds.length === 0 ||
      !newUserId
    ) {
      return NextResponse.json(
        { error: 'sessionIds (array) and newUserId are required' },
        { status: 400 }
      );
    }

    const db = await getChatDB();

    // 验证目标用户是否存在
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, newUserId),
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: `Target user with id ${newUserId} not found` },
        { status: 404 }
      );
    }

    // 验证源sessions是否存在
    const sourceSessions = await db.query.sessions.findMany({
      where: inArray(sessions.id, sessionIds),
    });

    if (sourceSessions.length !== sessionIds.length) {
      const foundIds = new Set(sourceSessions.map((s) => s.id));
      const missingIds = sessionIds.filter((id) => !foundIds.has(id));
      return NextResponse.json(
        { error: `Sessions not found: ${missingIds.join(', ')}` },
        { status: 404 }
      );
    }

    // 使用事务来确保数据一致性
    const result = await db.transaction(async (tx: Transaction) => {
      // 1. 批量更新sessions的userId
      const updatedSessions = await tx
        .update(sessions)
        .set({ userId: newUserId })
        .where(inArray(sessions.id, sessionIds))
        .returning();

      // 2. 查找这些sessions下的所有topics
      const sessionTopics = await tx
        .select({ id: topics.id })
        .from(topics)
        .where(inArray(topics.sessionId, sessionIds));

      const topicIds = sessionTopics.map((topic: { id: string }) => topic.id);

      // 3. 批量更新所有相关topics的userId
      let updatedTopicsCount = 0;
      if (topicIds.length > 0) {
        const updatedTopics = await tx
          .update(topics)
          .set({ userId: newUserId })
          .where(inArray(topics.id, topicIds))
          .returning();
        updatedTopicsCount = updatedTopics.length;
      }

      // 4. 查找所有相关topics下的messages
      let messageIds: string[] = [];
      if (topicIds.length > 0) {
        const sessionMessages = await tx
          .select({ id: messages.id })
          .from(messages)
          .where(inArray(messages.topicId, topicIds));
        messageIds = sessionMessages.map(
          (message: { id: string }) => message.id
        );
      }

      // 5. 批量更新所有相关messages的userId
      let updatedMessagesCount = 0;
      if (messageIds.length > 0) {
        const updatedMessages = await tx
          .update(messages)
          .set({ userId: newUserId })
          .where(inArray(messages.id, messageIds))
          .returning();
        updatedMessagesCount = updatedMessages.length;
      }

      return {
        sessions: updatedSessions,
        updatedTopicsCount,
        updatedMessagesCount,
        topicIds,
        messageIds,
      };
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
