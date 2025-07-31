import { memo, useEffect } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

import BackBottom from './BackBottom';

interface AutoScrollProps {
  atBottom: boolean;
  isScrolling: boolean;
  onScrollToBottom: (type: 'auto' | 'click') => void;
}
const AutoScroll = memo<AutoScrollProps>(
  ({ atBottom, isScrolling, onScrollToBottom }) => {
    const [isLoading, messages] = useChatStore((s) => [
      chatSelectors.sendMessageLoading(s),
      s.messages,
    ]);

    // 拼接所有消息内容
    const str = messages.map((m) => m.content || '').join('');
    // 找到最后一条 assistant 消息的 reasoning 字段
    const reasoningStr = (() => {
      const lastAssistant = [...messages]
        .reverse()
        .find((m) => m.role === 'assistant');
      return lastAssistant?.reasoning || '';
    })();

    useEffect(() => {
      if (atBottom && isLoading && !isScrolling) {
        onScrollToBottom?.('auto');
      }
    }, [atBottom, isLoading, str, reasoningStr]);

    return (
      <BackBottom
        onScrollToBottom={() => onScrollToBottom('click')}
        visible={!atBottom}
      />
    );
  }
);

export default AutoScroll;
