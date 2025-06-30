import { ActionIcon, Icon, Markdown, Tag, copyToClipboard } from '@lobehub/ui';
import { App } from 'antd';
import { useTheme } from 'antd-style';
import { ChevronDown, ChevronUp, ChevronsRight, CopyIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import BubblesLoading from '@/components/Loading/BubblesLoading';
import { useChatStore } from '@/store/chat';
import { MessageTranslateItem } from '@/services/message_translates';

interface TranslateProps extends Partial<MessageTranslateItem> {
  id: string;
  loading?: boolean;
}

const langMap: Record<string, string> = {
  'zh-CN': '简体中文',
  'ko-KR': '韩语',
};

const Translate = memo<TranslateProps>(({ content = '', from, to, id, loading }) => {
  const theme = useTheme();
  const [show, setShow] = useState(true);
  const clearTranslate = useChatStore((s) => s.clearTranslate);

  const { message } = App.useApp();
  return (
    <Flexbox gap={8}>
      <Flexbox align={'center'} horizontal justify={'space-between'}>
        <div>
          <Flexbox gap={4} horizontal>
            <Tag style={{ margin: 0 }}>{langMap[from || ''] || from || '...'}</Tag>
            <Icon color={theme.colorTextTertiary} icon={ChevronsRight} />
            <Tag>{langMap[to || ''] || to}</Tag>
          </Flexbox>
        </div>
        <Flexbox horizontal>
          <ActionIcon
            icon={CopyIcon}
            onClick={async () => {
              await copyToClipboard(content);
              message.success('复制成功');
            }}
            size={'small'}
            title={'复制'}
          />
          <ActionIcon
            icon={show ? ChevronDown : ChevronUp}
            onClick={() => {
              setShow(!show);
            }}
            size={'small'}
          />
        </Flexbox>
      </Flexbox>
      {!show ? null : loading && !content ? (
        <BubblesLoading />
      ) : (
        <Markdown variant={'chat'}>{content}</Markdown>
      )}
    </Flexbox>
  );
});

export default Translate;
