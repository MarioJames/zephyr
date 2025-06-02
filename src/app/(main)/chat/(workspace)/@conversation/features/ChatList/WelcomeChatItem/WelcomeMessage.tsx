import isEqual from 'fast-deep-equal';
import React, { useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ChatItem from '@/features/ChatItem';
import { useAgentStore } from '@/store/agent';
import { agentChatConfigSelectors, agentSelectors } from '@/store/agent/selectors';
import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors } from '@/store/session/selectors';

import OpeningQuestions from './OpeningQuestions';

const WelcomeMessage = () => {
  const type = useAgentStore(agentChatConfigSelectors.displayMode);
  const openingMessage = useAgentStore(agentSelectors.openingMessage);
  const openingQuestions = useAgentStore(agentSelectors.openingQuestions);

  const meta = useSessionStore(sessionMetaSelectors.currentAgentMeta, isEqual);

  const agentSystemRoleMsg = `你好，我是 **${meta.title || '自定义助手'}**，${meta.description}，让我们开始对话吧！`;

  const agentMsg = `你好，我是 **${meta.title || '自定义助手'}**，让我们开始对话吧！`;

  const message = useMemo(() => {
    if (openingMessage) return openingMessage;
    return !!meta.description ? agentSystemRoleMsg : agentMsg;
  }, [openingMessage, agentSystemRoleMsg, agentMsg, meta.description]);

  const chatItem = (
    <ChatItem
      avatar={meta}
      editing={false}
      message={message}
      placement={'left'}
      variant={type === 'chat' ? 'bubble' : 'docs'}
    />
  );

  return openingQuestions.length > 0 ? (
    <Flexbox>
      {chatItem}
      <OpeningQuestions questions={openingQuestions} />
    </Flexbox>
  ) : (
    chatItem
  );
};
export default WelcomeMessage;
