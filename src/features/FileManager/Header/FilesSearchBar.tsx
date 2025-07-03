'use client';

import { SearchBar } from '@lobehub/ui';
import { useQueryState } from 'nuqs';
import { memo, useState } from 'react';

const FilesSearchBar = memo<{ mobile?: boolean }>(({ mobile }) => {
  const [keywords, setKeywords] = useState<string>('');

  const [, setQuery] = useQueryState('q', {
    clearOnDefault: true,
  });

  return (
    <SearchBar
      allowClear
      enableShortKey={!mobile}
      onChange={(e: any) => {
        setKeywords(e.target.value);
        if (!e.target.value) setQuery(null);
      }}
      onPressEnter={() => setQuery(keywords)}
      placeholder="搜索文件"
      spotlight={!mobile}
      style={{ width: 320 }}
      value={keywords}
      variant={'filled'}
    />
  );
});

export default FilesSearchBar;
