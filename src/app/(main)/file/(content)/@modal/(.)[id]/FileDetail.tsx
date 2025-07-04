'use client';

import { memo } from 'react';

import { fileCoreSelectors, useFileStore } from '@/store/file';

import Detail from '../../../features/FileDetail';

const FileDetail = memo<{ id: string }>(({ id }) => {
  const file = useFileStore(fileCoreSelectors.getFileById(id));

  if (!file) return;

  return <Detail {...file} />;
});
export default FileDetail;
