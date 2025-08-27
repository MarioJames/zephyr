import { ActionIcon, Icon, Markdown, Tag, copyToClipboard } from '@lobehub/ui';
import { App } from 'antd';
import { useTheme } from 'antd-style';
import {
  ChevronDown,
  ChevronUp,
  ChevronsRight,
  CopyIcon,
  LanguagesIcon,
  Loader2,
} from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import BubblesLoading from '@/components/Loading/BubblesLoading';
import { MessageTranslateItem } from '@/services/message_translates';
import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';

interface TranslateProps extends Partial<MessageTranslateItem> {
  id: string;
  loading?: boolean;
}

const langMap: Record<string, string> = {
  'zh-CN': '简体中文',
  'ko-KR': '韩语',
};

const Translate = memo<TranslateProps>(
  ({ content = '', from, to, loading, id }) => {
    const theme = useTheme();
    const [show, setShow] = useState(true);
    const [translating, setTranslating] = useState(false);

    const { message } = App.useApp();
    const item = useChatStore(chatSelectors.getMessageById(id));
    const [autoTranslateMessage] = useChatStore((s) => [s.autoTranslateMessage]);

    const translateIcon = translating ? (
      <Icon icon={Loader2} spin />
    ) : (
      <Icon icon={LanguagesIcon} />
    );

    return (
      <Flexbox gap={8}>
        <Flexbox align={'center'} horizontal justify={'space-between'}>
          <div style={{ marginRight: 4 }}>
            <Flexbox gap={4} horizontal>
              <Tag style={{ margin: 0 }}>
                {langMap[from || ''] || from || '...'}
              </Tag>
              <Icon color={theme.colorTextTertiary} icon={ChevronsRight} />
              <Tag>{langMap[to || ''] || to}</Tag>
            </Flexbox>
          </div>
          <Flexbox horizontal>
            <ActionIcon
              icon={translateIcon}
              onClick={async () => {
                if (!item || translating) return;
                try {
                  setTranslating(true);
                  await autoTranslateMessage(
                    item.role as 'user' | 'assistant',
                    id,
                  );
                } finally {
                  setTranslating(false);
                }
              }}
              size={'small'}
              title={'重新翻译'}
            />
            <ActionIcon
              icon={CopyIcon}
              onClick={async () => {
                await copyToClipboard(content);
                message.success('复制成功');
              }}
              size={'small'}
              title={'复制译文'}
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
  }
);

export default Translate;
