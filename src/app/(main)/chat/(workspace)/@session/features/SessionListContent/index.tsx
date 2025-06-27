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
  const initialized = useSessionStore(sessionMetaSelectors.initialized);
  const sessionLength = useSessionStore(sessionMetaSelectors.sessionsCount);
  const isLoading = useSessionStore(sessionMetaSelectors.isLoading);
  const isInSearchMode = useSessionStore((s) => s.inSearchMode);
  const isUndefinedSessions = useSessionStore((s) =>
    !sessionMetaSelectors.initialized(s) && sessionSelectors.sessions(s).length === 0
  );
  const fetchSessions = useSessionStore((s) => s.fetchSessions);
  const initFromUrlParams = useSessionStore((s) => s.initFromUrlParams);
  const isAdmin = useOIDCStore(oidcSelectors.isCurrentUserAdmin);

  useEffect(() => {
    if (!initialized) {
      fetchSessions().then(() => {
        // 会话列表获取完成后，从URL参数初始化session和topic
        initFromUrlParams();
      });
    }
  }, [initialized, fetchSessions, initFromUrlParams]);

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
      {sessionLength === 0 && <Flexbox paddingInline={8}>暂时为空</Flexbox>}
      {<ShowMode />}
    </>
  );
});

SessionListContent.displayName = 'SessionListContent';

export default SessionListContent;
