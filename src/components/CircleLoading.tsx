'use client';

import { Icon } from '@lobehub/ui';
import { Typography } from 'antd';
import { LoaderCircle } from 'lucide-react';
import { Center, Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Center height={'100%'} width={'100%'}>
      <Flexbox align={'center'} gap={8}>
        <div>
          <Icon icon={LoaderCircle} size={'large'} spin />
        </div>
        <Typography.Text style={{ letterSpacing: '0.1em' }} type={'secondary'}>
          加载中...
        </Typography.Text>
      </Flexbox>
    </Center>
  );
};
