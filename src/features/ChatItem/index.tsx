'use client';

import { ChatItemProps, ChatItem as ChatItemRaw } from '@lobehub/ui/chat';
import { memo } from 'react';

interface ZephyrChatItemProps extends Omit<ChatItemProps, 'avatar'> {
  avatar?: string;
}

const ChatItem = memo<ZephyrChatItemProps>(
  ({ markdownProps = {}, avatar, ...rest }) => {
    const displayAvatar = {
      avatar: <img src={avatar} width={32} height={32} />,
      backgroundColor: 'rgba(0,0,0,0)',
      description: undefined,
    };

    return (
      <ChatItemRaw
        markdownProps={markdownProps}
        {...rest}
        avatar={displayAvatar}
      />
    );
  }
);

export default ChatItem;
