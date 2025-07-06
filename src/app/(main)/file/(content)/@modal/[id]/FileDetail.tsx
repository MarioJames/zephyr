'use client';

import { memo, useEffect } from 'react';

import { fileCoreSelectors, useFileStore } from '@/store/file';
import { filesAPI } from '@/services';

import Detail from '../../../features/FileDetail';

const FileDetail = memo<{ id: string }>(({ id }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(id));
  const setFiles = useFileStore((state) => state.setFiles);

  useEffect(() => {
    // 如果没有文件数据，则获取文件详情
    console.log('file', file);
    if (!file) {
      filesAPI.getFileDetail(id).then((fileData) => {
        setFiles([fileData]);
      });
    }
  }, [file, id, setFiles]);

  if (!file) return null;

  return <Detail {...file} />;
});

export default FileDetail;
