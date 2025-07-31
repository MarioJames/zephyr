'use client';
import React from 'react';

import ChatHydration from './features/ChatHydration';
import ChatInput from './features/ChatInput/index';
import ChatList from './features/ChatList';
import dynamic from 'next/dynamic';
import { useSessionStore , sessionSelectors } from '@/store/session';
import DefaultCreateCustomer from '@/components/DefaultCreateCustomer';

const ChatHeader = dynamic(() => import('../_layout/ChatHeader'));

const ChatConversation = () => {
  // 将所有 hooks 调用移到最前面，确保调用顺序一致
  const sessions = useSessionStore(sessionSelectors.sessions);
  const activeSessionId = useSessionStore(sessionSelectors.activeSessionId);
  const isInitialized = useSessionStore((s) => s.isInitialized);

  if (isInitialized && (!sessions || sessions.length === 0)) {
    return <DefaultCreateCustomer />;
  }

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

  return (
    <>
      <ChatHeader />
      <ChatList />
      <ChatInput />
      <ChatHydration />
    </>
  );
};

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;
