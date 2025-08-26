import { Button } from '@lobehub/ui';
import { Space } from 'antd';
import { createStyles } from 'antd-style';
import { rgba } from 'polished';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ShortcutHint from './ShortcutHint';
import { chatSelectors, useChatStore } from '@/store/chat';

const useStyles = createStyles(({ css, prefixCls, token }) => {
  return {
    arrow: css`
      &.${prefixCls}-btn.${prefixCls}-btn-icon-only {
        width: 28px;
      }
    `,
    loadingButton: css`
      display: flex;
      align-items: center;
    `,
    overrideAntdIcon: css`
      .${prefixCls}-btn.${prefixCls}-btn-icon-only {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .${prefixCls}-btn.${prefixCls}-dropdown-trigger {
        &::before {
          background-color: ${rgba(token.colorBgLayout, 0.1)} !important;
        }
      }
    `,
  };
});

interface FooterProps {
  onExpandChange: (expand: boolean) => void;
}

const Footer = memo<FooterProps>(({ onExpandChange }) => {
  const { styles } = useStyles();

  const [sendMessage, sendMessageLoading, isUploading] = useChatStore((s) => [
    s.sendMessage,
    chatSelectors.sendMessageLoading(s),
    chatSelectors.isUploading(s),
  ]);

  const loading = sendMessageLoading || isUploading;

  const [assistantLoading, setAssistantLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  return (
    <Flexbox
        align={'center'}
        className={styles.overrideAntdIcon}
        flex={'none'}
        gap={8}
        horizontal
        style={{ paddingRight: 16 }}
      >
        <ShortcutHint />
        <Space.Compact>
          <Button
            disabled={loading}
            loading={assistantLoading}
            onClick={async () => {
              setAssistantLoading(true);
              try {
                await sendMessage('assistant');
              } finally {
                setAssistantLoading(false);
              }
              onExpandChange(false);
            }}
            type={'default'}
          >
            {'发送员工消息'}
          </Button>
          <Button
            disabled={loading}
            loading={userLoading}
            onClick={async () => {
              setUserLoading(true);
              try {
                await sendMessage('user');
              } finally {
                setUserLoading(false);
              }
              onExpandChange(false);
            }}
            type={'primary'}
          >
            {'发送客户消息'}
          </Button>
        </Space.Compact>
      </Flexbox>
  );
});

Footer.displayName = 'Footer';

export default Footer;
