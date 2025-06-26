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
