import React, { memo } from 'react';

import { ChatItem } from '@/features/Conversation';

export interface ThreadChatItemProps {
  id: string;
}

const MainChatItem = memo<ThreadChatItemProps>(({ id }) => {
  return (
    <div id={`chat-message-${id}`}>
      <ChatItem id={id} />
    </div>
  );
});

MainChatItem.displayName = 'MainChatItem';

export default MainChatItem;
