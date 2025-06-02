import { Icon, Tag } from '@lobehub/ui';
import { Divider } from 'antd';
import { GitBranch } from 'lucide-react';
import { memo } from 'react';

const ThreadDivider = memo(() => {
  return (
    <div style={{ padding: '0 20px' }}>
      <Divider style={{ margin: 0, padding: '20px 0' }}>
        <Tag icon={<Icon icon={GitBranch} />}>{'子话题'}</Tag>
      </Divider>
    </div>
  );
});

export default ThreadDivider;
