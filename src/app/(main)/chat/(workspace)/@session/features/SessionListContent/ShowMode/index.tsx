"use client";

import isEqual from "fast-deep-equal";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";

import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session';

import SessionItem from "../SessionItem";
import SessionGroupItem from "./GroupItem";

const ShowMode = memo(() => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [currentSessionId] = useSessionStore((s) => [s.currentSessionId]);
  // 这里假设 sessions 没有分组，直接平铺
  const sessions = useSessionStore(sessionSelectors.sessions);
  const groupCounts = [sessions.length];
  const groups = [{ id: 'all', children: sessions }];
  const topics = sessions;

  const itemContent = useCallback(
    (index: number) => {
      const { id, title, employeeName } = topics[index];
      return (
        <SessionItem
          active={currentSessionId === id}
          id={id}
          key={id}
          title={title}
          employeeName={employeeName}
        />
      );
    },
    [currentSessionId, topics]
  );

  const groupContent = useCallback(
    (index: number) => {
      const topicGroup = groups[index];
      const showCount = topicGroup.id === 'all';
      return <SessionGroupItem {...topicGroup} count={showCount ? topicGroup.children.length : undefined} />;
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
