'use client';

import { ChatItemProps, ChatItem as ChatItemRaw } from '@lobehub/ui/chat';
import { memo } from 'react';

const ChatItem = memo<ChatItemProps>(({ markdownProps = {}, ...rest }) => {
  return <ChatItemRaw markdownProps={markdownProps} {...rest} />;
});

export default ChatItem;
