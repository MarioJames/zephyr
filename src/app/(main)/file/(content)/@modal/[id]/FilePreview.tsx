'use client';

import { Image } from 'antd';
import { memo } from 'react';
import { useTheme } from 'antd-style';
import { Center } from 'react-layout-kit';

import { fileCoreSelectors, useFileStore } from '@/store/file';

const FilePreview = memo<{ id: string }>(({ id }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(id));
  const theme = useTheme();
  if (!file) return null;

  // 只支持图片预览
  if (!file.fileType?.startsWith('image/')) {
    return (
      <Center height={'100%'}>
        <div
          style={{ color: theme.colorText, fontSize: '22px', fontWeight: 500 }}
        >
          此文件格式暂不支持在线预览
        </div>
      </Center>
    );
  }

  return (
    <Center height={'100%'}>
      <Image alt={file?.name || '图片'} src={file?.url} />
    </Center>
  );
});

export default FilePreview;
