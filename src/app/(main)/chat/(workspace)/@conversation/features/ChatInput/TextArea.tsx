import { memo } from 'react';

import InputArea from '@/features/ChatInput/Desktop/InputArea';
import { useSendMessage } from '@/features/ChatInput/useSend';
import { useChatStore } from '@/store/chat';

const TextArea = memo<{ onSend?: () => void }>(({ onSend }) => {
  const loading = useChatStore((s) => s.isLoading);
  const value = useChatStore((s) => s.inputMessage);
  const updateInputMessage = useChatStore((s) => s.updateInputMessage);
  const { send: sendMessage } = useSendMessage();

  return (
    <InputArea
      loading={loading}
      onChange={updateInputMessage}
      onSend={() => {
        sendMessage();
        onSend?.();
      }}
      value={value}
    />
  );
});

export default TextArea;
