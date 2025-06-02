import { ActionIcon, Button, Hotkey, Tooltip } from '@lobehub/ui';
import { Popconfirm } from 'antd';
import { LucideGalleryVerticalEnd, LucideMessageSquarePlus } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useActionSWR } from '@/libs/swr';
import { useChatStore } from '@/store/chat';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { HotkeyEnum } from '@/types/hotkey';

const SaveTopic = memo<{ mobile?: boolean }>(({ mobile }) => {
  const hotkey = useUserStore(settingsSelectors.getHotkeyById(HotkeyEnum.SaveTopic));
  const [hasTopic, openNewTopicOrSaveTopic] = useChatStore((s) => [
    !!s.activeTopicId,
    s.openNewTopicOrSaveTopic,
  ]);

  const { mutate, isValidating } = useActionSWR('openNewTopicOrSaveTopic', openNewTopicOrSaveTopic);

  const [confirmOpened, setConfirmOpened] = useState(false);

  const icon = hasTopic ? LucideMessageSquarePlus : LucideGalleryVerticalEnd;
  const desc = hasTopic ? '开启新话题' : '将当前会话保存为话题';

  if (mobile) {
    return (
      <Popconfirm
        arrow={false}
        okButtonProps={{ danger: false, type: 'primary' }}
        onConfirm={() => mutate()}
        onOpenChange={setConfirmOpened}
        open={confirmOpened}
        placement={'top'}
        title={
          <Flexbox align={'center'} horizontal style={{ marginBottom: 8 }}>
            <div style={{ marginRight: '16px', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
              {hasTopic ? '是否开启新话题?' : '是否保存当前会话为话题?'}
            </div>
            <Hotkey keys={hotkey} />
          </Flexbox>
        }
      >
        <ActionIcon
          aria-label={desc}
          icon={icon}
          loading={isValidating}
          onClick={() => setConfirmOpened(true)}
        />
      </Popconfirm>
    );
  } else {
    return (
      <Tooltip hotkey={hotkey} title={desc}>
        <Button aria-label={desc} icon={icon} loading={isValidating} onClick={() => mutate()} />
      </Tooltip>
    );
  }
});

export default SaveTopic;
