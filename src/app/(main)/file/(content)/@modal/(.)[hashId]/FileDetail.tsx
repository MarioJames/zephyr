'use client';

import { memo, useEffect } from 'react';

import { fileCoreSelectors, useFileStore } from '@/store/file';
import { filesAPI } from '@/services';

import Detail from '../../../features/FileDetail';

const FileDetail = memo<{ hashId: string }>(({ hashId }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(hashId));
  const setFiles = useFileStore((state) => state.setFiles);

  useEffect(() => {
    // 如果没有文件数据，则获取文件详情
    console.log('file', file);
    if (!file) {
      filesAPI.getFileDetail(hashId).then((fileData) => {
        setFiles([fileData]);
      });
    }
  }, [file, hashId, setFiles]);

  if (!file) return null;

  return <Detail {...file} />;
});

export default FileDetail;
