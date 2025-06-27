'use client';

import { Typography } from 'antd';
import isEqual from 'fast-deep-equal';
import React, { memo, useCallback, useRef } from 'react';
import { Center } from 'react-layout-kit';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session';

import { SkeletonList } from '../../SkeletonList';
import SessionItem from '../SessionItem';

const SearchResult = memo(() => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [currentSessionId, isSearching] = useSessionStore((s) => [
    s.currentSessionId,
    sessionMetaSelectors.isSearching(s),
  ]);
  const sessions = useSessionStore(sessionSelectors.searchResults, isEqual);

  const itemContent = useCallback(
    (index: number, item: any) => {
      const title = item?.title && item.title.trim() !== '' ? item.title : '默认客户';
      return (
        <SessionItem active={currentSessionId === item.id} id={item.id} key={item.id} title={title} />
      );
    },
    [currentSessionId],
  );

  const activeIndex = sessions.findIndex((session) => session.id === currentSessionId);

  if (isSearching) return <SkeletonList />;

  if (sessions.length === 0)
    return (
      <Center paddingBlock={12}>
        <Typography.Text type={'secondary'}>{'暂无搜索结果'}</Typography.Text>
      </Center>
    );

  return (
    <Virtuoso
      computeItemKey={(_, item) => item.id}
      data={sessions}
      defaultItemHeight={44}
      initialTopMostItemIndex={Math.max(activeIndex, 0)}
      itemContent={itemContent}
      overscan={44 * 10}
      ref={virtuosoRef}
    />
  );
});

SearchResult.displayName = 'SearchResult';

export default SearchResult;
