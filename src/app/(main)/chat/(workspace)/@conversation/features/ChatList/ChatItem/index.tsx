import React, { memo, useMemo } from 'react';

import { ChatItem } from '@/features/Conversation';
import ActionsBar from '@/features/Conversation/components/ChatItem/ActionsBar';

export interface ThreadChatItemProps {
  id: string;
}

const MainChatItem = memo<ThreadChatItemProps>(({ id }) => {
  const actionBar = useMemo(() => <ActionsBar id={id} />, [id]);

  return <ChatItem actionBar={actionBar} id={id} />;
});

MainChatItem.displayName = 'MainChatItem';

export default MainChatItem;
