import { Button, Tooltip } from '@lobehub/ui';
import { LucideGalleryVerticalEnd, LucideMessageSquarePlus } from 'lucide-react';
import { memo } from 'react';

import { useActionSWR } from '@/libs/swr';
import { useChatStore } from '@/store/chat';

const SaveTopic = memo(() => {
  const [hasTopic, openNewTopicOrSaveTopic] = useChatStore((s) => [
    !!s.activeTopicId,
    s.openNewTopicOrSaveTopic,
  ]);

  const { mutate, isValidating } = useActionSWR('openNewTopicOrSaveTopic', openNewTopicOrSaveTopic);

  const icon = hasTopic ? LucideMessageSquarePlus : LucideGalleryVerticalEnd;
  const desc = hasTopic ? '开启新话题' : '将当前会话保存为话题';
    return (
      <Tooltip title={desc}>
        <Button aria-label={desc} icon={icon} loading={isValidating} onClick={() => mutate()} />
      </Tooltip>
    );
});

export default SaveTopic;
