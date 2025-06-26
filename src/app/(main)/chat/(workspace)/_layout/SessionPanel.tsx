'use client';

import { DraggablePanel, DraggablePanelContainer } from '@lobehub/ui';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { PropsWithChildren, memo, useEffect, useState } from 'react';

import { CHAT_SIDEBAR_WIDTH } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';

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

  useEffect(() => {
    setCacheExpand(Boolean(showSessionPanel));
  }, [showSessionPanel]);

  const handleExpand = (expand: boolean) => {
    if (isEqual(expand, Boolean(showSessionPanel))) return;
    toggleSessionPanel(expand);
    setCacheExpand(expand);
  };

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
