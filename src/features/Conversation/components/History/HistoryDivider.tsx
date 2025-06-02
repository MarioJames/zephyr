import { Icon, Tag } from '@lobehub/ui';
import { Divider } from 'antd';
import { Timer } from 'lucide-react';
import { memo } from 'react';

interface HistoryDividerProps {
  enable?: boolean;
}

const HistoryDivider = memo<HistoryDividerProps>(({ enable }) => {
  if (!enable) return null;

  return (
    <div style={{ padding: '0 20px' }}>
      <Divider style={{ margin: 0, padding: '20px 0' }}>
        <Tag icon={<Icon icon={Timer} />}>历史范围</Tag>
      </Divider>
    </div>
  );
});

export default HistoryDivider;
