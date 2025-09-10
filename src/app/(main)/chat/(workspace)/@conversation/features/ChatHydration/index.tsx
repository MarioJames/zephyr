'use client';

import { useQueryState } from 'nuqs';
import { memo, useLayoutEffect } from 'react';
import { createStoreUpdater } from 'zustand-utils';

import { useSessionStore } from '@/store/session';

// sync outside state to useChatStore and useSessionStore
const ChatHydration = memo(() => {
  const useSessionStoreUpdater = createStoreUpdater(useSessionStore);

  // two-way bindings the topic params to chat store
  const [topic, setTopic] = useQueryState('topic', {
    history: 'replace',
    throttleMs: 500,
  });
  useSessionStoreUpdater('activeTopicId', topic);

  // two-way bindings the session params to session store
  const [session, setSession] = useQueryState('session', {
    history: 'replace',
    throttleMs: 500,
  });
  useSessionStoreUpdater('activeSessionId', session);

  // two-way bindings the userId params to session store
  const [, setUserId] = useQueryState('userId', {
    history: 'replace',
    throttleMs: 500,
  });

  useLayoutEffect(() => {
    // 订阅topic变化并同步到URL
    const unsubscribeTopic = useSessionStore.subscribe(
      (s) => s.activeTopicId,
      (state) => {
        setTopic(!state ? null : state);
      }
    );

    // 订阅session变化并同步到URL
    const unsubscribeSession = useSessionStore.subscribe(
      (s) => s.activeSessionId,
      (state) => {
        setSession(!state ? null : state);
      }
    );

    // 订阅userId变化并同步到URL
    const unsubscribeUserId = useSessionStore.subscribe(
      (s) => s.targetUserId,
      (state) => {
        setUserId(!state ? null : state);
      }
    );

    return () => {
      unsubscribeTopic();
      unsubscribeSession();
      unsubscribeUserId();
    };
  }, [setTopic, setSession, setUserId]);

  return null;
});

ChatHydration.displayName = 'ChatHydration';

export default ChatHydration;
