'use client';

import { Image } from 'antd';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { fileCoreSelectors, useFileStore } from '@/store/file';

const FilePreview = memo<{ hashId: string }>(({ hashId }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(hashId));

  if (!file) return null;

  // 只支持图片预览
  if (!file.fileType?.startsWith('image/')) {
    return (
      <Center height={'100%'}>
        <div>此文件格式暂不支持在线预览</div>
      </Center>
    );
  }

  return (
    <Center height={'100%'}>
      <Image src={file?.url} alt={file?.filename} />
    </Center>
  );
});

export default FilePreview;
