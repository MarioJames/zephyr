import { Button, copyToClipboard } from '@lobehub/ui';
import { App } from 'antd';
import { CopyIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ChatMessage } from '@/types/message';

import { useStyles } from '../style';
import Preview from './Preview';
import { generateMarkdown } from './template';

interface ShareTextProps {
  item: ChatMessage;
}

const ShareText = memo<ShareTextProps>(({ item }) => {
  const { styles } = useStyles();
  const { message } = App.useApp();

  const messages = [item];

  const content = generateMarkdown({
    messages,
  }).replaceAll('\n\n\n', '\n');

  const button = (
    <Button
        block
        icon={CopyIcon}
        onClick={async () => {
          await copyToClipboard(content);
          message.success('复制成功');
        }}
        size={'large'}
        type={'primary'}
      >
        {'复制'}
      </Button>
  );

  return (
    <Flexbox gap={16} horizontal>
      <Preview content={content} />
      <Flexbox className={styles.sidebar} gap={12}>
        {button}
      </Flexbox>
    </Flexbox>
  );
});

export default ShareText;
