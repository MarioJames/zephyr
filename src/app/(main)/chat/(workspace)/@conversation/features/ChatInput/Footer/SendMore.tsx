import { Button, Dropdown, Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import {
  BotMessageSquare,
  LucideChevronDown,
  MessageSquarePlus,
} from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';

const useStyles = createStyles(({ css, prefixCls }) => {
  return {
    arrow: css`
      &.${prefixCls}-btn.${prefixCls}-btn-icon-only {
        width: 28px;
      }
    `,
  };
});

interface SendMoreProps {
  disabled?: boolean;
}

const SendMore = memo<SendMoreProps>(({ disabled }) => {
  const { styles } = useStyles();

  // 本地状态管理发送方式偏好，默认使用 Enter 发送
  const { sendMessage } = useChatStore();

  return (
    <Dropdown
      disabled={disabled}
      menu={{
        items: [
          {
            icon: <Icon icon={BotMessageSquare} />,
            key: 'addAi',
            label: '添加一条 AI 消息',
            onClick: () => {
              sendMessage('assistant');
            },
          },
          {
            icon: <Icon icon={MessageSquarePlus} />,
            key: 'addUser',
            label: (
              <Flexbox align={'center'} gap={24} horizontal>
                {'添加一条用户消息'}
              </Flexbox>
            ),
            onClick: () => {
              sendMessage('user');
            },
          },
        ],
      }}
      placement={'topRight'}
      trigger={['hover']}
    >
      <Button
        aria-label={'更多'}
        className={styles.arrow}
        icon={LucideChevronDown}
        type={'primary'}
      />
    </Dropdown>
  );
});

SendMore.displayName = 'SendMore';

export default SendMore;
