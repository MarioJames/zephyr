import { useCallback, useMemo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { SendMessageParams } from '@/types/message';

export type UseSendMessageParams = Pick<
  SendMessageParams,
  'onlyAddUserMessage' | 'isWelcomeQuestion'
>;

export const useSendMessage = () => {
  const sendMessage = useChatStore((s) => s.sendMessage);
  const updateInputMessage = useChatStore((s) => s.updateInputMessage);
  const inputMessage = useChatStore((s) => s.inputMessage);
  const isLoading = useChatStore((s) => s.isLoading);
  const createTopic = useChatStore((s) => s.createTopic);
  const switchTopic = useChatStore((s) => s.switchTopic);

  const canSend = !!inputMessage && !isLoading;

  const send = useCallback(async () => {
    const store = useChatStore.getState();
    if (store.isLoading) return;
    if (!store.inputMessage) return;
    if (!store.activeSessionId) return;

    let topicId = store.activeTopicId;
    // 如果没有 activeTopicId，先创建一个新话题
    if (!topicId) {
      const topic = await createTopic({
        title: store.inputMessage,
        sessionId: store.activeSessionId,
      });
      topicId = topic.id;
      switchTopic(topicId);
    }

    await sendMessage({
      content: store.inputMessage,
      sessionId: store.activeSessionId,
      topicId,
    });
    updateInputMessage('');
  }, []);

  return useMemo(() => ({ canSend, send }), [canSend]);
};
