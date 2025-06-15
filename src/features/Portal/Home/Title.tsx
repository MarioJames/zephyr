'use client';

import { Typography } from 'antd';
import { memo } from 'react';

const Title = memo(() => {
  return (
    <Typography.Text style={{ fontSize: 16 }} type={'secondary'}>
      工作区
    </Typography.Text>
  );
});

export default Title;
