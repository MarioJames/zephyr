import { ActionIcon, Button } from '@lobehub/ui';
import { LucideNotepadText, PlusSquareIcon } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { chatPortalSelectors, chatSelectors } from '@/store/chat/selectors';

const Footer = () => {
  const [messageId, isAIGenerating, triggerAIMessage, saveSearchResult] = useChatStore((s) => [
    chatPortalSelectors.toolMessageId(s),
    chatSelectors.isAIGenerating(s),
    s.triggerAIMessage,
    s.saveSearchResult,
  ]);

  return (
    <Flexbox gap={8} horizontal paddingBlock={12} paddingInline={12}>
      <Button
        icon={LucideNotepadText}
        loading={isAIGenerating}
        onClick={() => {
          if (!messageId) return;

          triggerAIMessage({});
        }}
      >
        {'总结'}
      </Button>
      <ActionIcon
        icon={PlusSquareIcon}
        loading={isAIGenerating}
        onClick={() => {
          if (!messageId) return;

          saveSearchResult(messageId);
        }}
        title={'新建搜索'}
      />
    </Flexbox>
  );
};

export default Footer;
