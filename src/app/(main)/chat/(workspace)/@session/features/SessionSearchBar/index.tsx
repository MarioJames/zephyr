'use client';

import { SearchBar } from '@lobehub/ui';
import { useUnmount } from 'ahooks';
import { memo, useState } from 'react';

import { useChatStore } from '@/store/chat';

const SessionSearchBar = memo<{ onClear?: () => void }>(({ onClear }) => {
  const [tempValue, setTempValue] = useState('');
  const [searchKeyword, setSearchKeywords] = useState('');
  const [activeSessionId, useSearchTopics] = useChatStore((s) => [s.activeId, s.useSearchTopics]);

  useSearchTopics(searchKeyword, activeSessionId);

  useUnmount(() => {
    useChatStore.setState({ inSearchingMode: false, isSearchingTopic: false });
  });

  const startSearchSession = () => {
    if (tempValue === searchKeyword) return;

    setSearchKeywords(tempValue);
    useChatStore.setState({ inSearchingMode: !!tempValue, isSearchingTopic: !!tempValue });
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

export default SessionSearchBar;
