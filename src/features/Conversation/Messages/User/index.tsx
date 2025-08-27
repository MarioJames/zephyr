import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { ActionIcon } from '@lobehub/ui';
import { Copy as CopyIcon } from 'lucide-react';
import { App } from 'antd';
import { useChatStore } from '@/store/chat';

import BubblesLoading from '@/components/Loading/BubblesLoading';
import { LOADING_FLAT } from '@/const/base';
import { MessageItem } from '@/services';

import FileListViewer from './FileListViewer';
import ImageFileListViewer from './ImageFileListViewer';

export const UserMessage = memo<
  MessageItem & {
    editableContent: ReactNode;
  }
>(({ id, editableContent, content, imageList, fileList }) => {
  const { message } = App.useApp();
  const [copyMessage] = useChatStore((s) => [s.copyMessage]);

  if (content === LOADING_FLAT) return <BubblesLoading />;

  return (
    <Flexbox gap={8} id={id}>
      <div style={{ position: 'relative', paddingRight: 32 }}>
        {editableContent}
        <div style={{ position: 'absolute', right: 4, top: 4 }}>
          <ActionIcon
            icon={CopyIcon}
            onClick={async () => {
              await copyMessage(id);
              message.success('复制成功');
            }}
            size={'small'}
            title={'复制原文'}
          />
        </div>
      </div>
      {imageList && imageList?.length > 0 && (
        <ImageFileListViewer items={imageList} />
      )}
      {fileList && fileList?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <FileListViewer items={fileList} />
        </div>
      )}
    </Flexbox>
  );
});

export { MarkdownRender as UserMarkdownRender } from './MarkdownRender';
