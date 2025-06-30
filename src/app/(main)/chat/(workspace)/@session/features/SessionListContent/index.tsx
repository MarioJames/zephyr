'use client';

import React, { memo, useEffect } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Button } from '@lobehub/ui';
import { ChevronDown, Plus } from 'lucide-react';
import { createStyles } from 'antd-style';
import { useRouter } from 'next/navigation';

import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import { useOIDCStore } from '@/store/oidc';
import { oidcSelectors } from '@/store/oidc/selectors';

import { SkeletonList } from '../SkeletonList';
import ShowMode from './ShowMode';
import SearchResult from './SearchResult';

const useStyles = createStyles(({ css, token }) => ({
  button: css`
    display: flex;
    height: 32px;
    justify-content: center;
    align-items: center;
    gap: 4px;
    border-radius: 6px;
    border: 1px solid ${token.colorBorder};
    background: inherit;
    color: ${token.colorText};
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
  const isAdmin = useOIDCStore(oidcSelectors.isCurrentUserAdmin);

  const {
    // state
    sessions,
    isLoading,
    inSearchMode,
    searchResults,

    // actions
    fetchSessions,
    initFromUrlParams,
  } = useSessionStore();

  useEffect(() => {
    fetchSessions();
    initFromUrlParams();
  }, []);

  const handleAddCustomer = () => {
    router.push('/customer/form');
  };

  if (inSearchMode) return <SearchResult />;
  if (isLoading) return <SkeletonList />;

  return (
    <>
      <Flexbox
        horizontal
        align='center'
        justify='space-between'
        className={styles.flexbox}
      >
        {isAdmin && (
          <Button type='default' className={styles.button} style={{ flex: 1 }}>
            全部员工
            <ChevronDown size={16} />
          </Button>
        )}
        <Button
          type='default'
          icon={<Plus size={16} />}
          className={styles.button}
          style={!isAdmin ? { flex: 1 } : {}}
          onClick={handleAddCustomer}
        >
          创建客户
        </Button>
      </Flexbox>
      {sessions.length === 0 && <Flexbox paddingInline={8}>暂时为空</Flexbox>}
      {<ShowMode />}
    </>
  );
});

SessionListContent.displayName = 'SessionListContent';

export default SessionListContent;
