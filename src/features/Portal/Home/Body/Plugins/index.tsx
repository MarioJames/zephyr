import { Typography } from 'antd';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ArtifactList from './ArtifactList';

export const Artifacts = memo(() => {
  return (
    <Flexbox gap={8}>
      <Typography.Title level={5} style={{ marginInline: 12 }}>
        插件
      </Typography.Title>
      <ArtifactList />
    </Flexbox>
  );
});

export default Artifacts;
