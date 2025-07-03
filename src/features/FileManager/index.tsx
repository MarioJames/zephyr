'use client';

import { Typography } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileList from './FileList';
import Header from './Header';
import UploadDock from './UploadDock';

interface FileManagerProps {
  category?: string;
  title: string;
}

const FileManager = memo<FileManagerProps>(({ title, category }) => {
  return (
    <>
      <Header />
      <Flexbox gap={12} height={'100%'}>
        <Typography.Text strong style={{ fontSize: 16, marginBlock: 16, marginInline: 24 }}>
          {title}
        </Typography.Text>
        <FileList category={category} />
      </Flexbox>
      <UploadDock />
    </>
  );
});

export default FileManager;
