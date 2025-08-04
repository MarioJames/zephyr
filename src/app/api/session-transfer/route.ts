import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm/expressions';
import { getLobeDB } from '@/database/lobeDB';
import { sessions, topics, messages, users } from '@/database/lobeDB/schemas';
import { Transaction } from '@/database/lobeDB/type';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, newUserId } = await request.json();

    if (!sessionId || !newUserId) {
      return NextResponse.json(
        { error: 'sessionId and newUserId are required' },
        { status: 400 }
      );
    }

    const db = await getLobeDB();

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

    // 验证源session是否存在
    const sourceSession = await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
    });

    if (!sourceSession) {
      return NextResponse.json(
        { error: `Session with id ${sessionId} not found` },
        { status: 404 }
      );
    }

    // 使用事务来确保数据一致性
    const result = await db.transaction(async (tx: Transaction) => {
      // 1. 更新session的userId
      const updatedSession = await tx
        .update(sessions)
        .set({ userId: newUserId })
        .where(eq(sessions.id, sessionId))
        .returning();

      if (updatedSession.length === 0) {
        throw new Error(`Session with id ${sessionId} not found`);
      }

      // 2. 查找该session下的所有topics
      const sessionTopics = await tx
        .select({ id: topics.id })
        .from(topics)
        .where(eq(topics.sessionId, sessionId));

      const topicIds = sessionTopics.map((topic: { id: string }) => topic.id);

      // 3. 更新所有相关topics的userId
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
        messageIds = sessionMessages.map((message: { id: string }) => message.id);
      }

      // 5. 更新所有相关messages的userId
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
        session: updatedSession[0],
        updatedTopicsCount,
        updatedMessagesCount,
        topicIds,
        messageIds,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Session transfer completed successfully',
      data: result,
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to transfer session',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

