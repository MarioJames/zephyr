import { Popconfirm } from 'antd';
import { Eraser } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

import { useChatStore } from '@/store/chat';

import Action from '../components/Action';

export const useClearCurrentMessages = () => {
  const clearMessage = useChatStore((s) => s.clearMessage);

  return useCallback(async () => {
    await clearMessage();
  }, [clearMessage]);
};

const Clear = memo(() => {
  const clearCurrentMessages = useClearCurrentMessages();
  const [confirmOpened, updateConfirmOpened] = useState(false);

  const actionTitle: any = confirmOpened ? void 0 : '清空当前会话消息';

  const popconfirmPlacement = 'topRight';

  return (
    <Popconfirm
      arrow={false}
      okButtonProps={{ danger: true, type: 'primary' }}
      onConfirm={clearCurrentMessages}
      onOpenChange={updateConfirmOpened}
      open={confirmOpened}
      placement={popconfirmPlacement}
      title={
        <div style={{ marginBottom: '8px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
          {'即将清空当前会话消息，清空后将无法找回，请确认你的操作'}
        </div>
      }
    >
      <Action
        icon={Eraser}
        title={actionTitle}
        tooltipProps={{
          placement: 'bottom',
          styles: {
            root: { maxWidth: 'none' },
          },
        }}
      />
    </Popconfirm>
  );
});

export default Clear;
