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

const ChatHeader = dynamic(() => import('../_layout/ChatHeader'));

const ChatConversation = (props: DynamicLayoutProps) => {
  const currentSessionId = useSessionStore(sessionSelectors.currentSessionId);
  const activeTopicId = useChatStore((s) => s.activeTopicId);
  const fetchMessagesByTopic = useChatStore((s) => s.fetchMessagesByTopic);
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);

  useEffect(() => {
    if (activeTopicId) {
      fetchMessagesByTopic(activeTopicId);
    }
  }, [activeTopicId]);

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
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {isLoading && <div>加载中...</div>}
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: 12 }}>{msg.content}</div>
        ))}
      </div>
    </>
  );
};

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;
