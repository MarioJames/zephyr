import { Modal, Segmented, type SegmentedProps } from '@lobehub/ui';
import { memo, useMemo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatMessage } from '@/types/message';

import ShareText from './ShareText';

enum Tab {
  Screenshot = 'screenshot',
  Text = 'text',
}

interface ShareModalProps {
  message: ChatMessage;
  onCancel: () => void;
  open: boolean;
}

const ShareModal = memo<ShareModalProps>(({ onCancel, open, message }) => {
  const [tab, setTab] = useState<Tab>(Tab.Screenshot);

  const options: SegmentedProps['options'] = useMemo(
    () => [
      {
        label: '文本',
        value: Tab.Text,
      },
    ],
    [],
  );

  return (
    <Modal
      allowFullscreen
      centered={false}
      footer={null}
      onCancel={onCancel}
      open={open}
      title={'分享'}
      width={1440}
    >
      <Flexbox gap={24}>
        <Segmented
          block
          onChange={(value) => setTab(value as Tab)}
          options={options}
          style={{ width: '100%' }}
          value={tab}
          variant={'filled'}
        />
        {tab === Tab.Text && <ShareText item={message} />}
      </Flexbox>
    </Modal>
  );
});

export default ShareModal;
