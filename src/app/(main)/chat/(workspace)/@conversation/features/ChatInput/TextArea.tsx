import { memo } from 'react';

import InputArea from '@/features/ChatInput/Desktop/InputArea';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

const TextArea = memo<{ onSend?: () => void }>(({ onSend }) => {
  const [isLoading, inputMessage, updateInputMessage, sendMessage] =
    useChatStore((s) => [
      chatSelectors.sendMessageLoading(s),
      s.inputMessage,
      s.updateInputMessage,
      s.sendMessage,
    ]);

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

TextArea.displayName = 'TextArea';

export default TextArea;
