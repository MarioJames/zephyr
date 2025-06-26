'use client';

import React, { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Button } from 'antd';
import { ChevronDown, Plus } from 'lucide-react';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';

import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session';

import { SkeletonList } from '../SkeletonList';
import ShowMode from './ShowMode';
import SearchResult from './SearchResult';

const useStyles = createStyles(({ css }) => ({
  button: css`
    display: flex;
    height: 32px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: inherit;
    color: #000;
    flex: 1;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  `,
  flexbox: css`
    padding: 0 8px;
    gap: 8px;
  `,
}));

const SessionListContent = memo(() => {
  const router = useRouter();
  const { styles } = useStyles();
  const [initialized, sessionLength, isLoading, isInSearchMode, isUndefinedSessions, fetchSessions] = useSessionStore((s) => [
    sessionMetaSelectors.initialized(s),
    sessionMetaSelectors.sessionsCount(s),
    sessionMetaSelectors.isLoading(s),
    sessionMetaSelectors.isSearching(s),
    !sessionMetaSelectors.initialized(s) && sessionSelectors.sessions(s).length === 0,
    s.fetchSessions,
  ]);

  useEffect(() => {
    if (!initialized) fetchSessions();
  }, [initialized, fetchSessions]);

  const handleAddCustomer = () => {
    router.push('/customer/edit');
  };

  if (isInSearchMode) return <SearchResult />;
  if (isLoading || isUndefinedSessions) return <SkeletonList />;

  return (
    <>
      <Flexbox
        horizontal
        align='center'
        justify='space-between'
        className={styles.flexbox}
      >
        <Button type='default' className={styles.button}>
          全部员工
          <ChevronDown size={16} />
        </Button>
        <Button
          type='default'
          icon={<Plus size={16} />}
          className={`${styles.button}`}
          onClick={handleAddCustomer}
        >
          创建客户
        </Button>
      </Flexbox>
      {sessionLength === 0 && <Flexbox paddingInline={8}>暂时为空</Flexbox>}
      {<ShowMode />}
    </>
  );
});

SessionListContent.displayName = 'SessionListContent';

export default SessionListContent;
