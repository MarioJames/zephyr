'use client';

import { memo } from 'react';

import PageTitle from '@/components/PageTitle';
import { withSuspense } from '@/components/withSuspense';
import { useChatStore } from '@/store/chat';
import { topicSelectors } from '@/store/chat/selectors';
import { sessionSelectors, useSessionStore } from '@/store/session';

const Title = memo(() => {
  const currentSession = useSessionStore(sessionSelectors.currentSession);

  const topicTitle = useChatStore(
    (s) => topicSelectors.currentActiveTopic(s)?.title
  );
  return (
    <PageTitle
      title={[topicTitle, currentSession?.title].filter(Boolean).join(' · ')}
    />
  );
});

export default withSuspense(Title);
