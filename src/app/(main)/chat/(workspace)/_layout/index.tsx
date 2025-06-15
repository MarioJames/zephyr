import { Suspense } from 'react';
import { Flexbox } from 'react-layout-kit';

import BrandTextLoading from '@/components/BrandTextLoading';

import { LayoutProps } from './type';
import ChatHeader from './ChatHeader';
import Portal from './Portal';
import TopicPanel from './TopicPanel';

const Layout = ({
  children,
  topic,
  conversation,
  portal,
  history,
}: LayoutProps) => {
  return (
    <>
      <Flexbox
        height={'100%'}
        horizontal
        style={{ overflow: 'hidden', position: 'relative' }}
        width={'100%'}
      >
        <TopicPanel>{topic || history}</TopicPanel>
        <Flexbox
          height={'100%'}
          style={{ overflow: 'hidden', position: 'relative' }}
          width={'100%'}
        >
          <ChatHeader />
          {conversation}
        </Flexbox>
        {children}
        <Portal>
          <Suspense fallback={<BrandTextLoading />}>{portal}</Suspense>
        </Portal>
        <TopicPanel>{topic || history}</TopicPanel>
      </Flexbox>
    </>
  );
};

Layout.displayName = 'DesktopConversationLayout';

export default Layout;
