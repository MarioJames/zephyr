'use client';

import { SearchBar } from '@lobehub/ui';
import { useQueryState } from 'nuqs';
import { memo, useState } from 'react';

import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyEnum } from '@/types/hotkey';

const FilesSearchBar = memo<{ mobile?: boolean }>(({ mobile }) => {
  const hotkey = useUserStore(settingsSelectors.getHotkeyById(HotkeyEnum.Search));
  const [keywords, setKeywords] = useState<string>('');

  const [, setQuery] = useQueryState('q', {
    clearOnDefault: true,
  });

  return (
    <SearchBar
      allowClear
      enableShortKey={!mobile}
      onChange={(e) => {
        setKeywords(e.target.value);
        if (!e.target.value) setQuery(null);
      }}
      onPressEnter={() => setQuery(keywords)}
      placeholder="搜索文件"
      shortKey={hotkey}
      spotlight={!mobile}
      style={{ width: 320 }}
      value={keywords}
      variant={'filled'}
    />
  );
});

export default FilesSearchBar;
