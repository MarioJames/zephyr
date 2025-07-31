'use client';

import { SearchBar } from '@lobehub/ui';
import { useUnmount } from 'ahooks';
import { memo, useState } from 'react';

import { useSessionStore } from '@/store/session';

const SessionSearchBar = memo<{ onClear?: () => void }>(({ onClear }) => {
  const [tempValue, setTempValue] = useState('');
  const [searchKeyword, setSearchKeywords] = useState('');
  const [searchSessions, clearSearchResults] = useSessionStore((s) => [
    s.searchSessions,
    s.clearSearchResults,
  ]);

  // 搜索会话
  const doSearch = (keyword: string) => {
    searchSessions({ keyword });
  };

  // 清除搜索
  useUnmount(() => {
    clearSearchResults();
  });

  const startSearchSession = () => {
    if (tempValue.trim() === '') {
      clearSearchResults();
      onClear?.();
      return;
    }
    if (tempValue === searchKeyword) return;
    setSearchKeywords(tempValue);
    doSearch(tempValue);
  };

  return (
    <SearchBar
      autoFocus
      onBlur={() => {
        if (tempValue === '') {
          onClear?.();
          return;
        }
        startSearchSession();
      }}
      onChange={(e) => {
        setTempValue(e.target.value);
      }}
      onPressEnter={startSearchSession}
      placeholder={'搜索会话...'}
      spotlight={true}
      value={tempValue}
      variant={'filled'}
    />
  );
});

SessionSearchBar.displayName = 'SessionSearchBar';

export default SessionSearchBar;
