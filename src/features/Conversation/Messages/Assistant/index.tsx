import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ImageFileListViewer from '@/features/Conversation/Messages/User/ImageFileListViewer';
import { MessageItem } from '@/services';

import { DefaultMessage } from '../Default';
import FileListViewer from '../User/FileListViewer';

export const AssistantMessage = memo<
  MessageItem & {
    editableContent: ReactNode;
  }
>(({ id, content, imageList, fileList, ...props }) => {
  const showImageItems = !!imageList && imageList.length > 0;

  return (
    <Flexbox gap={8} id={id}>
      {content && (
        <DefaultMessage
          addIdOnDOM={false}
          content={content}
          id={id}
          {...props}
        />
      )}
      {showImageItems && <ImageFileListViewer items={imageList} />}
      {fileList && fileList?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <FileListViewer items={fileList} />
        </div>
      )}
    </Flexbox>
  );
});
