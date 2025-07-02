'use client';

import { DraggablePanel, DraggablePanelContainer } from '@lobehub/ui';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { PropsWithChildren, memo, useEffect, useState } from 'react';

import { CHAT_SIDEBAR_WIDTH } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

const useStyles = createStyles(({ css, token }) => ({
  content: css`
    display: flex;
    flex-direction: column;
    height: 100% !important;
  `,
  drawer: css`
    z-index: 20;
    background: ${token.colorBgContainerSecondary};
  `,
  header: css`
    border-block-end: 1px solid ${token.colorBorderSecondary};
  `,
}));

const SessionPanel = memo(({ children }: PropsWithChildren) => {
  const { styles } = useStyles();
  const { md = true, lg = true } = useResponsive();

  // 使用全局状态管理
  const showSessionPanel = useGlobalStore(systemStatusSelectors.showSessionPanel);
  const toggleSessionPanel = useGlobalStore((s) => s.toggleSessionPanel);
  const [cacheExpand, setCacheExpand] = useState<boolean>(Boolean(showSessionPanel));
  
  // 获取 sessions 状态
  const sessions = useSessionStore(sessionSelectors.sessions);
  const [userCollapsed, setUserCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setCacheExpand(Boolean(showSessionPanel));
  }, [showSessionPanel]);

  // 处理手动展开/收起
  const handleExpand = (expand: boolean) => {
    if (isEqual(expand, Boolean(showSessionPanel))) return;
    toggleSessionPanel(expand);
    setCacheExpand(expand);
    setUserCollapsed(!expand);
  };

  // 根据 sessions 自动控制展开状态
  useEffect(() => {
    if (sessions.length === 0) {
      toggleSessionPanel(false);
      setCacheExpand(false);
    } else if (!userCollapsed) {
      toggleSessionPanel(true);
      setCacheExpand(true);
    }
  }, [sessions, toggleSessionPanel, userCollapsed]);

  useEffect(() => {
    if (lg && cacheExpand) toggleSessionPanel(true);
    if (!lg) toggleSessionPanel(false);
  }, [lg, cacheExpand, toggleSessionPanel]);

  return (
    <DraggablePanel
      className={styles.drawer}
      classNames={{
        content: styles.content,
      }}
      expand={showSessionPanel}
      minWidth={CHAT_SIDEBAR_WIDTH}
      mode={md ? 'fixed' : 'float'}
      onExpandChange={handleExpand}
      placement={'left'}
      showHandleWideArea={false}
    >
      <DraggablePanelContainer
        style={{
          flex: 'none',
          height: '100%',
          maxHeight: '100vh',
          minWidth: CHAT_SIDEBAR_WIDTH,
        }}
      >
        {children}
      </DraggablePanelContainer>
    </DraggablePanel>
  );
});

export default SessionPanel;
