'use client';

import { memo } from 'react';

import PageTitle from '@/components/PageTitle';
import { withSuspense } from '@/components/withSuspense';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { sessionSelectors, useSessionStore } from '@/store/session';

const Title = memo(() => {
  const activeSession = useSessionStore(sessionSelectors.activeSession);

  const topicTitle = useChatStore(
    (s) => chatSelectors.currentActiveTopic(s)?.title
  );
  return (
    <PageTitle
      title={[topicTitle, activeSession?.title].filter(Boolean).join(' · ')}
    />
  );
});

export default withSuspense(Title);
