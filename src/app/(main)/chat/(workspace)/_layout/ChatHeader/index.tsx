'use client';

import { ChatHeader } from '@lobehub/ui/chat';

import HeaderAction from './HeaderAction';
import Main from './Main';

const Header = () => {
  return (
    <ChatHeader
      left={<Main />}
      right={<HeaderAction />}
      style={{
        height: 56,
        padding: '0px 16px',
        position: 'initial',
        zIndex: 11,
        gap: 10,
      }}
    />
  );
};

Header.displayName = 'Header';

export default Header;
