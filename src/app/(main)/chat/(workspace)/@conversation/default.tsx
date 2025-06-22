import { DynamicLayoutProps } from '@/types/next';

import ChatHydration from './features/ChatHydration';
import ChatInput from './features/ChatInput/index';
import ChatList from './features/ChatList';
import ZenModeToast from './features/ZenModeToast';

const ChatConversation = async (props: DynamicLayoutProps) => {

  return (
    <>
      <ZenModeToast />
      <ChatList />
      <ChatInput/>
      <ChatHydration />
    </>
  );
};

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;
