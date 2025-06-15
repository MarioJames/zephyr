import { Typography } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import FileList from './FileList';

export const Files = memo(() => {
  return (
    <Flexbox gap={8}>
      <Typography.Title level={5} style={{ marginInline: 12 }}>
        文件
      </Typography.Title>
      <FileList />
    </Flexbox>
  );
});

export default Files;
