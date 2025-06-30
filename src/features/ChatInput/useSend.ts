import { useCallback, useMemo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { SendMessageParams } from '@/types/message';

export type UseSendMessageParams = Pick<
  SendMessageParams,
  'onlyAddUserMessage' | 'isWelcomeQuestion'
>;

export const useSendMessage = () => {
  const { sendMessage, updateInputMessage, inputMessage, isLoading } =
    useChatStore();

  const canSend = !!inputMessage && !isLoading;

  const send = useCallback(async () => {
    const store = useChatStore.getState();
    if (store.isLoading) return;
    if (!store.inputMessage) return;
    if (!store.activeSessionId) return;

    await sendMessage({
      content: store.inputMessage,
      sessionId: store.activeSessionId,
      topicId: store.activeTopicId || '',
    });

    updateInputMessage('');
  }, []);

  return useMemo(() => ({ canSend, send }), [canSend]);
};
