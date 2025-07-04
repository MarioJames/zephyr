'use client';

import { Image } from 'antd';
import { memo } from 'react';
import { Center } from 'react-layout-kit';

import { fileCoreSelectors, useFileStore } from '@/store/file';

const FilePreview = memo<{ id: string }>(({ id }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(id));

  if (!file) return null;

  // 只支持图片预览
  if (!file.type?.startsWith('image/')) {
    return (
      <Center height={'100%'}>
        <div>此文件格式暂不支持在线预览</div>
      </Center>
    );
  }

  return (
    <Center height={'100%'}>
      <Image src={file.url} alt={file.name} />
    </Center>
  );
});

export default FilePreview;
