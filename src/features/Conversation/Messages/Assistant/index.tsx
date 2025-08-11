import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ImageFileListViewer from '@/features/Conversation/Messages/User/ImageFileListViewer';
import { MessageItem } from '@/services';

import { DefaultMessage } from '../Default';

export const AssistantMessage = memo<
  MessageItem & {
    editableContent: ReactNode;
  }
>(({ id, content, imageList, ...props }) => {
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
    </Flexbox>
  );
});
