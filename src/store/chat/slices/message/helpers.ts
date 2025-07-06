import { FileItem } from '@/services/files';
import { MessageItem } from '@/services/messages';

export function transformMessagesWithFileClassification(
  messages: MessageItem[]
): MessageItem[] {
  return messages.map((message) => {
    if (!message.files || message.files.length === 0) {
      return {
        ...message,
        imageList: [],
        fileList: [],
      };
    }

    const { imageList, fileList } = message.files.reduce<{
      imageList: FileItem[];
      fileList: FileItem[];
    }>(
      (acc, file) => {
        if (file.fileType && file.fileType.startsWith('image/')) {
          acc.imageList.push(file);
        } else {
          acc.fileList.push(file);
        }

        return acc;
      },
      { imageList: [] as FileItem[], fileList: [] as FileItem[] }
    );

    return {
      ...message,
      imageList,
      fileList,
    };
  });
}
export function transformMessageWithFileClassification(
  message: MessageItem
): MessageItem {
  if (!message.files || message.files.length === 0) {
    return {
      ...message,
      imageList: [],
      fileList: [],
    };
  }

  const { imageList, fileList } = message.files.reduce<{
    imageList: FileItem[];
    fileList: FileItem[];
  }>(
    (acc, file) => {
      if (file.fileType && file.fileType.startsWith('image/')) {
        acc.imageList.push(file);
      } else {
        acc.fileList.push(file);
      }

      return acc;
    },
    { imageList: [] as FileItem[], fileList: [] as FileItem[] }
  );

  return {
    ...message,
    imageList,
    fileList,
  };
}
