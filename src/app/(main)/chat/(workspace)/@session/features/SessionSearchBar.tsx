'use client';

import { SearchBar } from '@lobehub/ui';
import { memo } from 'react';

import { useSessionStore } from '@/store/session';

const SessionSearchBar = memo(() => {

  const [keywords, useSearchSessions, updateSearchKeywords] = useSessionStore((s) => [
    s.sessionSearchKeywords,
    s.useSearchSessions,
    s.updateSearchKeywords,
  ]);

  const { isValidating } = useSearchSessions(keywords);

  return (
    <SearchBar
      allowClear
      enableShortKey={true}
      loading={isValidating}
      onChange={(e) => {
        updateSearchKeywords(e.target.value);
      }}
      placeholder={"搜索助手..."}
      spotlight={true}
      value={keywords}
      variant={'filled'}
    />
  );
});

export default SessionSearchBar;
