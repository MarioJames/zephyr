import React, { memo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import WelcomeMessage from './WelcomeMessage';

const WelcomeChatItem = memo(() => {
  const showInboxWelcome = useChatStore(chatSelectors.showInboxWelcome);

  if (showInboxWelcome) return <div>欢迎</div>;

  return <WelcomeMessage />;
});

export default WelcomeChatItem;
