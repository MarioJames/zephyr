'use client';
import { DynamicLayoutProps } from '@/types/next';
import React, { useEffect } from 'react';
import { useChatStore } from '@/store/chat';

import ChatHydration from './features/ChatHydration';
import ChatInput from './features/ChatInput/index';
import ChatList from './features/ChatList';
import ZenModeToast from './features/ZenModeToast';
import dynamic from 'next/dynamic';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session';
import DefaultCreateCustomer from '@/components/DefaultCreateCustomer';

const ChatHeader = dynamic(() => import('../_layout/ChatHeader'));

const ChatConversation = (props: DynamicLayoutProps) => {
  // 将所有 hooks 调用移到最前面，确保调用顺序一致
  const sessions = useSessionStore((s) => s.sessions);
  const currentSessionId = useSessionStore(sessionSelectors.currentSessionId);
  const activeTopicId = useChatStore((s) => s.activeTopicId);
  const fetchMessagesByTopic = useChatStore((s) => s.fetchMessagesByTopic);

  useEffect(() => {
    if (activeTopicId) {
      fetchMessagesByTopic(activeTopicId);
    }
  }, [activeTopicId]);


  // 条件渲染移到 hooks 调用之后
  if (!sessions || sessions.length === 0) {
    return <DefaultCreateCustomer />;
  }

  if (!currentSessionId) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: 18 }}>
        请选择客户后进行对话哦
      </div>
    );
  }
  
  return (
    <>
      <ZenModeToast />
      <ChatHeader />
      <ChatList />
      <ChatInput/>
      <ChatHydration />
    </>
  );
};

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;
