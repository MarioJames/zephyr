import React, { memo, useMemo } from 'react';

import { ChatItem } from '@/features/Conversation';
import ActionsBar from '@/features/Conversation/components/ChatItem/ActionsBar';

export interface ThreadChatItemProps {
  id: string;
  index: number;
}

const MainChatItem = memo<ThreadChatItemProps>(({ id, index }) => {
  const actionBar = useMemo(() => <ActionsBar id={id} index={index} />, [id]);

  return <ChatItem actionBar={actionBar} id={id} />;
});

export default MainChatItem;
