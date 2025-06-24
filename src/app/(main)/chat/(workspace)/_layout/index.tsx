import { Flexbox } from 'react-layout-kit';

import { LayoutProps } from './type';
import ChatHeader from './ChatHeader';
import TopicPanel from './TopicPanel';
import SlotPanel from './SlotPanel';

const Layout = ({
  children,
  topic,
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
        <TopicPanel>{topic}</TopicPanel>
        <Flexbox
          height={'100%'}
          style={{ overflow: 'hidden', position: 'relative' }}
          width={'100%'}
        >
          <ChatHeader />
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
