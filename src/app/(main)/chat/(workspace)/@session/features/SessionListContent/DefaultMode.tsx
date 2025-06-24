import isEqual from 'fast-deep-equal';
import { memo } from 'react';

import { useFetchSessions } from '@/hooks/useFetchSessions';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import SessionList from './List';

const DefaultMode = memo(() => {
  useFetchSessions();
  // const defaultSessions = useSessionStore(sessionSelectors.defaultSessions, isEqual);
  const defaultSessions = [
    {
      id: "inbox",
      type: "agent",
      meta: {
        title: "默认会话",
        description: "这是一个默认会话",
        avatar: "🤖",
      },
      config: {
        id: "agent-001",
        model: "gpt-4o-mini",
        systemRole: "助手",
        params: {
          temperature: 0.7,
          max_tokens: 2048,
        },
        chatConfig: {
          historyCount: 10,
          compressThreshold: 1000,
          maxTokens: 2048,
          systemPrompt: "你是一个智能助手",
          userPrefix: "用户",
          assistantPrefix: "助手",
        },
        files: [],
        knowledgeBases: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return <SessionList dataSource={defaultSessions || []} />;
});

DefaultMode.displayName = 'SessionDefaultMode';

export default DefaultMode;
