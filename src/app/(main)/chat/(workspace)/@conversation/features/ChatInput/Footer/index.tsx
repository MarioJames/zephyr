import { Button } from '@lobehub/ui';
import { Space } from 'antd';
import { createStyles } from 'antd-style';
import { rgba } from 'polished';
import { Suspense, memo, useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import StopLoadingIcon from '@/components/StopLoading';
import { useSendMessage } from '@/features/ChatInput/useSend';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { isMacOS } from '@/utils/platform';

import MessageFromUrl from './MessageFromUrl';
import SendMore from './SendMore';
import ShortcutHint from './ShortcutHint';

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
  expand: boolean;
  onExpandChange: (expand: boolean) => void;
}

const Footer = memo<FooterProps>(({ onExpandChange, expand }) => {
  const { styles } = useStyles();

  // 移除AI生成状态，因为我们的对话都是确定内容，没有流式生成
  const isLoading = useChatStore((s) => s.isLoading);

  const { send: sendMessage, canSend } = useSendMessage();

  const [isMac, setIsMac] = useState<boolean>();

  useEffect(() => {
    setIsMac(isMacOS());
  }, [setIsMac]);

  return (
    <>
      <Suspense>
        <MessageFromUrl />
      </Suspense>
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
            disabled={!canSend || isLoading}
            loading={isLoading}
            onClick={() => {
              sendMessage();
              onExpandChange?.(false);
            }}
            type={'primary'}
          >
            {'发送'}
          </Button>
          <SendMore disabled={!canSend || isLoading} isMac={isMac} />
        </Space.Compact>
      </Flexbox>
    </>
  );
});

Footer.displayName = 'Footer';

export default Footer;
