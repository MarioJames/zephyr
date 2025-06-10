import { createStyles } from 'antd-style';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { shinyTextStylish } from '@/styles/loading';

export const useStyles = createStyles(({ css, token }) => ({
  apiName: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    font-family: ${token.fontFamilyCode};
    font-size: 12px;
    text-overflow: ellipsis;
  `,

  shinyText: shinyTextStylish(token),
}));

interface ToolTitleProps {
  apiName: string;
  identifier: string;
  index: number;
  messageId: string;
  toolCallId: string;
}

const ToolTitle = memo<ToolTitleProps>(({ identifier, messageId, index, apiName, toolCallId }) => {
  const { styles } = useStyles();

  const isLoading = useChatStore((s) => {
    const toolMessageId = chatSelectors.getMessageByToolCallId(toolCallId)(s)?.id;
    const isToolCallStreaming = chatSelectors.isToolCallStreaming(messageId, index)(s);
    const isPluginApiInvoking = !toolMessageId
      ? true
      : chatSelectors.isPluginApiInvoking(toolMessageId)(s);
    return isToolCallStreaming || isPluginApiInvoking;
  });

  const pluginTitle = '未知插件';

  return (
    <Flexbox align={'center'} className={isLoading ? styles.shinyText : ''} gap={4} horizontal>
      <div>{pluginTitle}</div>/<span className={styles.apiName}>{apiName}</span>
    </Flexbox>
  );
});

export default ToolTitle;
