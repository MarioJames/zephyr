import { ReactNode, memo } from 'react';
import { ActionIcon } from '@lobehub/ui';
import { Copy as CopyIcon } from 'lucide-react';
import { App } from 'antd';
import { useChatStore } from '@/store/chat';

import BubblesLoading from '@/components/Loading/BubblesLoading';
import { LOADING_FLAT } from '@/const/base';
import { MessageItem } from '@/services';

export const DefaultMessage = memo<
  MessageItem & {
    addIdOnDOM?: boolean;
    editableContent: ReactNode;
    isToolCallGenerating?: boolean;
  }
>(
  ({
    id,
    editableContent,
    content,
    isToolCallGenerating,
    addIdOnDOM = true,
  }) => {
    const { message } = App.useApp();
    const [copyMessage] = useChatStore((s) => [s.copyMessage]);
    if (isToolCallGenerating) return;

    if (content === LOADING_FLAT) return <BubblesLoading />;

    return (
      <div
        id={addIdOnDOM ? id : undefined}
        style={{ position: 'relative', paddingRight: 32 }}
      >
        {editableContent}
        <div style={{ position: 'absolute', right: 4, top: 4  }}>
          <ActionIcon
            icon={CopyIcon}
            onClick={async () => {
              await copyMessage(id);
              message.success('复制成功');
            }}
            size={'small'}
            title={'复制原文'}
          />
        </div>
      </div>
    );
  }
);

export const DefaultBelowMessage = memo<MessageItem>(() => {
  return null;
});
