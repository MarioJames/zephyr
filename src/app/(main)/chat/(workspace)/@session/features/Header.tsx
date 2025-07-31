'use client';

import { createStyles } from 'antd-style';
import { ActionIcon } from '@lobehub/ui';
import { Search } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import SidebarHeader from '@/components/SidebarHeader';

import SessionSearchBar from './SessionSearchBar';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    color: ${token.colorText};
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();
  const [showSearch, setShowSearch] = useState(false);

  return showSearch ? (
    <Flexbox padding={'12px 16px 4px'}>
      <SessionSearchBar onClear={() => setShowSearch(false)} />
    </Flexbox>
  ) : (
    <SidebarHeader
      actions={
        <ActionIcon
            className={styles.container}
            icon={Search}
            onClick={() => setShowSearch(true)}
            size={'middle'}
          />
      }
      title={`对话`}
    />
  );
});

Header.displayName = 'Header';

export default Header;
