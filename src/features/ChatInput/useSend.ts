import { useCallback, useMemo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { SendMessageParams } from '@/types/message';

export type UseSendMessageParams = Pick<
  SendMessageParams,
  'onlyAddUserMessage' | 'isWelcomeQuestion'
>;

export const useSendMessage = () => {
  const [sendMessage, updateInputMessage, inputMessage, isLoading] = useChatStore((s) => [
    s.sendMessage,
    s.updateInputMessage,
    s.inputMessage,
    s.isLoading,
  ]);

  const canSend = !!inputMessage && !isLoading;

  const send = useCallback(() => {
    const store = useChatStore.getState();
    if (store.isLoading) return;
    if (!store.inputMessage) return;

    sendMessage(store.inputMessage);
    updateInputMessage('');
  }, []);

  return useMemo(() => ({ canSend, send }), [canSend]);
};
