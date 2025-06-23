'use client';

import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSessionStore } from '@/store/session';

import SessionSearchBar from '../../features/SessionSearchBar';

export const useStyles = createStyles(({ css, token }) => ({
  logo: css`
    color: ${token.colorText};
    fill: ${token.colorText};
  `,
  top: css`
    position: sticky;
    inset-block-start: 0;
    padding-block-start: 10px;
  `,
}));

const Header = memo(() => {
  const { styles } = useStyles();
  const [createSession] = useSessionStore((s) => [s.createSession]);

  return (
    <Flexbox className={styles.top} gap={16} paddingInline={8}>
      <SessionSearchBar />
    </Flexbox>
  );
});

export default Header;
