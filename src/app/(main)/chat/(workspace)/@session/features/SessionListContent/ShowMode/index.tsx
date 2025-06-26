"use client";

import isEqual from "fast-deep-equal";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";

import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session';
import { sessionHelpers } from '@/store/session';

import SessionItem from "../SessionItem";
import SessionGroupItem from "./GroupItem";

const ShowMode = memo(() => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [currentSessionId] = useSessionStore((s) => [s.currentSessionId]);
  // 获取所有会话并排序
  const sessions = useSessionStore(sessionSelectors.sessions);
  const sortedSessions = useMemo(() => sessionHelpers.sortSessions(sessions, 'updatedAt'), [sessions]);

  // 分组逻辑：最近客户（前7个），全部客户（所有）
  const recentSessions = sortedSessions.slice(0, 7);
  const allSessions = sortedSessions;
  const groups = [
    { id: 'recent', title: '最近客户', children: recentSessions },
    { id: 'all', title: '全部客户', children: allSessions },
  ];
  const groupCounts = [recentSessions.length, allSessions.length];
  // flatSessions 需与 groupCounts 对应，先 recent 再 all
  const flatSessions = [...recentSessions, ...allSessions];

  const itemContent = useCallback(
    (index: number) => {
      const session = flatSessions[index];
      const title = session?.title && session.title.trim() !== '' ? session.title : '默认客户';
      return (
        <SessionItem
          active={currentSessionId === session.id}
          id={session.id}
          key={session.id}
          title={title}
        />
      );
    },
    [currentSessionId, flatSessions]
  );

  const groupContent = useCallback(
    (index: number) => {
      const sessionGroup = groups[index];
      // 只有"全部客户"分组才展示数量
      const count = sessionGroup.id === 'all' ? sessionGroup.children.length : undefined;
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

ShowMode.displayName = "ShowMode";

export default ShowMode;
