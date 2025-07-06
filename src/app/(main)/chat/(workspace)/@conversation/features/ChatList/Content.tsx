'use client';

import React, { memo, useCallback } from 'react';

import { SkeletonList, VirtualizedList } from '@/features/Conversation';
import { useFetchMessages } from '@/hooks/useFetchMessages';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import DefaultHelloShow from '@/components/DefaultHelloShow';

import MainChatItem from './ChatItem';

const Content = memo(() => {
  const isCurrentChatLoaded = useChatStore(chatSelectors.isCurrentChatLoaded);
  const activeSessionId = useSessionStore(sessionSelectors.activeSessionId);

  useFetchMessages();

  const messagesIds = useChatStore((s) => chatSelectors.messagesIds(s));

  const itemContent = useCallback(
    (index: number, id: string) => <MainChatItem id={id} index={index} />,
    []
  );

  if (!activeSessionId) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 18,
        }}
      >
        请选择客户后进行对话哦
      </div>
    );
  }

  if (!isCurrentChatLoaded) return <SkeletonList />;

  if (messagesIds?.length === 0) return <DefaultHelloShow />;

  return <VirtualizedList dataSource={messagesIds} itemContent={itemContent} />;
});

Content.displayName = 'ChatListRender';

export default Content;
