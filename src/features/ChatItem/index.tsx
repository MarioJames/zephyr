'use client';

import { ChatItemProps, ChatItem as ChatItemRaw } from '@lobehub/ui/chat';
import { memo } from 'react';

const ChatItem = memo<ChatItemProps>(({ markdownProps = {}, ...rest }) => {
  const avatar = {
    avatar: "🤖",
    backgroundColor: "rgba(0,0,0,0)",
    description: undefined,
    title: "大三 ",
  };

  return <ChatItemRaw markdownProps={markdownProps} {...rest} avatar={avatar} />;
});

export default ChatItem;
