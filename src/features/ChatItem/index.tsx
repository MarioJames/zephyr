'use client';

import { ChatItemProps, ChatItem as ChatItemRaw } from '@lobehub/ui/chat';
import { memo } from 'react';
import { Avatar } from '@lobehub/ui';

interface ZephyrChatItemProps extends Omit<ChatItemProps, 'avatar'> {
  avatar?: string;
  name?: string;
}

const ChatItem = memo<ZephyrChatItemProps>(
  ({ markdownProps = {}, avatar, name, ...rest }) => {
    const displayAvatar = {
      avatar: (
        <Avatar
          avatar={avatar || name?.[0] || '客'}
          size={40}
          style={{
            fontSize: 18,
          }}
        />
      ),
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
