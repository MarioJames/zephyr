import { memo } from 'react';

import InputArea from '@/features/ChatInput/Desktop/InputArea';
import { useChatStore } from '@/store/chat';

const TextArea = memo<{ onSend?: () => void }>(({ onSend }) => {
  const { isLoading, inputMessage, updateInputMessage, sendMessage } =
    useChatStore();

  return (
    <InputArea
      loading={isLoading}
      onChange={(value) => {
        updateInputMessage(value);
      }}
      onSend={() => {
        sendMessage('user');
        onSend?.();
      }}
      value={inputMessage}
    />
  );
});

export default TextArea;
