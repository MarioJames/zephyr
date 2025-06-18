"use client";

import isEqual from "fast-deep-equal";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { GroupedVirtuoso, VirtuosoHandle } from "react-virtuoso";

import { useChatStore } from "@/store/chat";
import { topicSelectors } from "@/store/chat/selectors";

import TopicItem from "../TopicItem";
import TopicGroupItem from "./GroupItem";

const ShowMode = memo(() => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [activeTopicId, activeThreadId] = useChatStore((s) => [
    s.activeTopicId,
    s.activeThreadId,
  ]);
  const groupTopics = useChatStore(
    topicSelectors.groupedTopicsSelector,
    isEqual
  );

  const { groups, groupCounts, topics } = useMemo(() => {
    const groups = groupTopics;
    const groupCounts = groups.map((group) => group.children.length);
    const topics = groups.flatMap((group) => group.children);
    return { groups, groupCounts, topics };
  }, [groupTopics]);

  const itemContent = useCallback(
    (index: number) => {
      const { id, title } = topics[index];

      return (
        <TopicItem
          active={activeTopicId === id}
          id={id}
          key={id}
          threadId={activeThreadId}
          title={title}
        />
      );
    },
    [activeTopicId, topics, activeThreadId]
  );

  const groupContent = useCallback(
    (index: number) => {
      const topicGroup = groups[index];
      return <TopicGroupItem {...topicGroup} />;
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
