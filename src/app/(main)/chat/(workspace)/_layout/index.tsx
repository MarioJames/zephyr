import { Flexbox } from 'react-layout-kit';

import { LayoutProps } from './type';
import ChatHeader from './ChatHeader';
import SessionPanel from './SessionPanel';
import SlotPanel from './SlotPanel';

const Layout = ({
  children,
  session,
  conversation,
}: LayoutProps) => {
  return (
    <>
      <Flexbox
        height={'100%'}
        horizontal
        style={{ overflow: 'hidden', position: 'relative' }}
        width={'100%'}
      >
        <SessionPanel>{session}</SessionPanel>
        <Flexbox
          height={'100%'}
          style={{ overflow: 'hidden', position: 'relative' }}
          width={'100%'}
        >
          {conversation}
        </Flexbox>
        {children}
        <SlotPanel />
      </Flexbox>
    </>
  );
};

Layout.displayName = 'DesktopConversationLayout';

export default Layout;
