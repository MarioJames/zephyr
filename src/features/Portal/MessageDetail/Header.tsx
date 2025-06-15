import { Typography } from 'antd';
import { Flexbox } from 'react-layout-kit';

import { oneLineEllipsis } from '@/styles';

const Header = () => {
  return (
    <Flexbox align={'center'} gap={4} horizontal>
      <Typography.Text className={oneLineEllipsis} style={{ fontSize: 16 }} type={'secondary'}>
        消息详情
      </Typography.Text>
    </Flexbox>
  );
};

export default Header;
