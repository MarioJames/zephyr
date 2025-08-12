'use client';

import React, { memo, useCallback, useRef, useState } from 'react';
import { GroupedVirtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Tabs } from 'antd';
import { createStyles } from 'antd-style';

import { useSessionStore , sessionSelectors } from '@/store/session';

import SessionItem from '../SessionItem';

const useStyles = createStyles(({ css }) => ({
  container: css`
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  tabsContainer: css`
    flex-shrink: 0;
    padding: 0 24px;
    margin: 8px 0;
    
    .ant-tabs-tab {
      padding: 4px 12px !important;
      font-size: 13px;
    }
    
    .ant-tabs-content-holder {
      display: none;
    }
  `,
  listContainer: css`
    flex: 1;
    min-height: 0;
  `,
}));

const ShowMode = memo(() => {
  const { styles } = useStyles();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [activeSessionId] = useSessionStore((s) => [s.activeSessionId]);
  const [activeTab, setActiveTab] = useState<string>('recent');

  // 分别获取最近客户和全部客户
  const recentSessions = useSessionStore(sessionSelectors.recentSessions);
  const allSessions = useSessionStore(sessionSelectors.sessions);
  
  // 根据当前选中的tab确定要显示的数据
  const currentSessions = activeTab === 'recent' ? recentSessions : allSessions;

  const itemContent = useCallback(
    (index: number) => {
      const session = currentSessions[index] || {};
      const title =
        session?.title && session.title?.trim() !== ''
          ? session.title
          : `默认客户${index + 1}`;
      return (
        <SessionItem
          active={activeSessionId === session?.id}
          avatar={session?.avatar}
          id={session?.id}
          isRecent={activeTab === 'recent'}
          key={session?.id}
          title={title}
          user={session?.user}
        />
      );
    },
    [activeSessionId, currentSessions, activeTab]
  );

  const tabItems = [
    {
      key: 'recent',
      label: `最近客户`,
    },
    {
      key: 'all',
      label: `全部客户${allSessions.length > 0 ? ` (${allSessions.length})` : ''}`,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={setActiveTab}
          size="small"
          tabBarStyle={{
            margin: 0,
            borderBottom: 'none',
          }}
        />
      </div>
      <div className={styles.listContainer}>
        <GroupedVirtuoso
          groupContent={() => null}
          groupCounts={[currentSessions.length]}
          itemContent={itemContent}
          ref={virtuosoRef}
        />
      </div>
    </div>
  );
});

ShowMode.displayName = 'ShowMode';

export default ShowMode;
