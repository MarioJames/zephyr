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
  const targetUserId = useSessionStore(sessionSelectors.targetUserId);
  const isInitialized = useSessionStore(sessionSelectors.isInitialized);
  const isLoading = useSessionStore(sessionSelectors.isLoading);

  // 只有在本人登录且没有sessions时才显示DefaultCreateCustomer
  // 如果targetUserId有值，说明正在查看别人的对话，不应该显示创建客户界面
  // 如果正在加载中，也不应该显示，避免取消选中时的中间态闪烁
  if (isInitialized && (!sessions || sessions.length === 0) && !targetUserId && !isLoading) {
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
        {targetUserId ? '请选择要查看的对话' : '请选择客户后进行对话哦'}
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
