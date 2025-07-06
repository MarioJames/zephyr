'use client';

import React, { memo, useCallback, useMemo, useRef } from 'react';
import { GroupedVirtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';

import SessionItem from '../SessionItem';
import SessionGroupItem from './GroupItem';

const ShowMode = memo(() => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [activeSessionId] = useSessionStore((s) => [s.activeSessionId]);

  // 分组逻辑：最近客户（前5个），全部客户（所有）
  const recentSessions = useSessionStore(sessionSelectors.recentSessions);
  const allSessions = useSessionStore(sessionSelectors.sessions);
  const groups = [
    { id: 'recent', title: '最近客户', children: recentSessions },
    { id: 'all', title: '全部客户', children: allSessions },
  ];
  const groupCounts = [recentSessions.length, allSessions.length];
  // flatSessions 顺序与 groupCounts 对应，全部客户分组始终展示所有客户
  const flatSessions = [...recentSessions, ...allSessions];

  const itemContent = useCallback(
    (index: number) => {
      // 判断属于哪个分组
      const isRecent = index < recentSessions.length;
      const session = flatSessions[index] || {};
      const title =
        session?.title && session.title?.trim() !== ''
          ? session.title
          : `默认客户${index + 1}`;
      return (
        <SessionItem
          active={activeSessionId === session?.id}
          id={session?.id}
          key={session?.id}
          title={title}
          isRecent={isRecent}
          user={session?.user}
          avatar={session?.avatar}
        />
      );
    },
    [activeSessionId, flatSessions, recentSessions?.length]
  );

  const groupContent = useCallback(
    (index: number) => {
      const sessionGroup = groups[index];
      // 只有"全部客户"分组才展示数量
      const count =
        sessionGroup.id === 'all' ? sessionGroup.children.length : undefined;
      return <SessionGroupItem {...sessionGroup} count={count} />;
    },
    [groups]
  );
  return (
    <GroupedVirtuoso
      groupContent={groupContent}
      groupCounts={groupCounts}
      itemContent={itemContent}
      ref={virtuosoRef}
    />
  );
});

ShowMode.displayName = 'ShowMode';

export default ShowMode;
