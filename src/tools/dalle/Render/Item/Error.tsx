import { Alert, Button, Highlighter } from '@lobehub/ui';
import { LucideRefreshCw } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

interface ErrorProps {
  index: number;
  messageId: string;
}

const Error = memo<ErrorProps>(({ messageId, index }) => {
  const error = useChatStore(
    (s) => chatSelectors.getMessageById(messageId)(s)?.pluginState?.['error']?.[index],
  );
  const [reInvokeToolMessage] = useChatStore((s) => [s.reInvokeToolMessage]);

  return (
    error && (
      <Flexbox gap={12}>
        <Alert
          extra={
            <Highlighter actionIconSize={'small'} language={'json'}>
              {JSON.stringify(error?.body || error, null, 2)}
            </Highlighter>
          }
          extraDefaultExpand
          message={'图片生成出错'}
          type={'error'}
        />
        <Button
          icon={LucideRefreshCw}
          onClick={() => reInvokeToolMessage(messageId)}
          type={'primary'}
        >
          {'重试'}
        </Button>
      </Flexbox>
    )
  );
});

export default Error;
