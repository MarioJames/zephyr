'use client';

import { DraggablePanel, DraggablePanelContainer } from '@lobehub/ui';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { PropsWithChildren, memo, useEffect, useState } from 'react';

import { CHAT_SIDEBAR_WIDTH } from '@/const/layoutTokens';
import { useSessionStore } from '@/store/session';

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

  // 本地 UI 状态管理（替代 showTopicPanel/toggleTopicPanel）
  const [showSessionPanel, setShowSessionPanel] = useState(true);
  const [cacheExpand, setCacheExpand] = useState<boolean>(showSessionPanel);

  useEffect(() => {
    setCacheExpand(showSessionPanel);
  }, [showSessionPanel]);

  const handleExpand = (expand: boolean) => {
    if (expand === showSessionPanel) return;
    setShowSessionPanel(expand);
    setCacheExpand(expand);
  };

  useEffect(() => {
    if (lg && cacheExpand) setShowSessionPanel(true);
    if (!lg) setShowSessionPanel(false);
  }, [lg, cacheExpand]);

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
