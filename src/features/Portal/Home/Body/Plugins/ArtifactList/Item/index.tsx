import { Icon, Tag } from '@lobehub/ui';
import { Typography } from 'antd';
import { CircuitBoard } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useYamlArguments } from '@/hooks/useYamlArguments';
import { useChatStore } from '@/store/chat';
import { ChatPluginPayload } from '@/types/message';

import { useStyles } from './style';

export interface ArtifactItemProps {
  identifier?: string;
  messageId: string;
  payload?: ChatPluginPayload;
}

const ArtifactItem = memo<ArtifactItemProps>(({ payload, messageId, identifier = 'unknown' }) => {
  const { styles, cx } = useStyles();

  const args = useYamlArguments(payload?.arguments);

  const openToolUI = useChatStore((s) => s.openToolUI);

  return (
    <Flexbox
      align={'center'}
      className={styles.container}
      gap={8}
      horizontal
      onClick={() => {
        if (!identifier) return;

        openToolUI(messageId, identifier);
      }}
    >
      <Flexbox align={'center'} distribution={'space-between'} gap={24} horizontal>
        <Flexbox align={'center'} gap={8} horizontal>
          <Flexbox gap={4}>
            <Flexbox align={'center'} gap={8} horizontal>
              <Tag>{payload?.apiName}</Tag>
            </Flexbox>
            <div>
              <Typography.Text ellipsis style={{ fontSize: 12 }} type={'secondary'}>
                {args}
              </Typography.Text>
            </div>
          </Flexbox>
        </Flexbox>
        <Flexbox>
            <div className={cx(styles.tag, styles.tagBlue)} style={{ cursor: 'pointer' }} title="">
              <Icon icon={CircuitBoard} />
            </div>
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default ArtifactItem;
