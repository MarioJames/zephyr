'use client';

import { DraggablePanel, DraggablePanelContainer } from '@lobehub/ui';
import { createStyles, useResponsive } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useEffect, useState } from 'react';

import { CHAT_SLOT_SIDEBAR_WIDTH } from '@/const/layoutTokens';
import { useGlobalStore } from '@/store/global';
import { systemStatusSelectors } from '@/store/global/selectors';
import AIHintPanel from './SlotPanelAIHint';
import HistoryPanel from './SlotPanelHistory';

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

const SlotPanel = memo(() => {
  const { styles } = useStyles();
  const { md = true, lg = true } = useResponsive();
  const [showSlotPanel, toggleSlotPanel] = useGlobalStore((s) => [
    systemStatusSelectors.showSlotPanel(s),
    s.toggleSlotPanel,
  ]);
  const slotPanelType = useGlobalStore((s) => s.status.slotPanelType || 'aiHint');

  const [cacheExpand, setCacheExpand] = useState<boolean>(Boolean(showSlotPanel));

  useEffect(() => {
    setCacheExpand(Boolean(showSlotPanel));
  }, [showSlotPanel]);

  const handleExpand = (expand: boolean) => {
    if (isEqual(expand, Boolean(showSlotPanel))) return;
    toggleSlotPanel(expand);
    setCacheExpand(expand);
  };

  useEffect(() => {
    if (lg && cacheExpand) toggleSlotPanel(true);
    if (!lg) toggleSlotPanel(false);
  }, [lg, cacheExpand, toggleSlotPanel]);

  return (
    <DraggablePanel
      className={styles.drawer}
      classNames={{
        content: styles.content,
      }}
      expand={showSlotPanel}
      minWidth={CHAT_SLOT_SIDEBAR_WIDTH}
      mode={md ? 'fixed' : 'float'}
      onExpandChange={handleExpand}
      placement={'right'}
      showHandleWideArea={false}
    >
      <DraggablePanelContainer
        style={{
          flex: 'none',
          height: '100%',
          maxHeight: '100vh',
          minWidth: CHAT_SLOT_SIDEBAR_WIDTH,
        }}
      >
        {slotPanelType === 'history' ? <HistoryPanel /> : <AIHintPanel /> }
      </DraggablePanelContainer>
    </DraggablePanel>
  );
});

export default SlotPanel;
