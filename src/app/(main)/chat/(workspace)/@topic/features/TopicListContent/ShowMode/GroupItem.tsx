import { createStyles } from 'antd-style';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { Button } from 'antd';
import { ChevronDown, Plus } from 'lucide-react';

import { GroupedTopic } from '@/types/topic';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    color: ${token.colorTextQuaternary};
    background: ${token.colorBgContainerSecondary};
    box-shadow: 0 3px 4px -2px ${token.colorBgContainerSecondary};
  `,
}));

interface TopicGroupItemProps extends Omit<GroupedTopic, 'children'> {
  count?: number;
}

const TopicGroupItem = memo<TopicGroupItemProps>(({ title, count, id }) => {
  const { styles } = useStyles();

  return (
    <>
      <Flexbox className={styles.container} paddingBlock={'12px 8px'} paddingInline={12} horizontal align="center" justify="space-between">
        <span>{title}</span>
        {typeof count === 'number' && (
          <span style={{ color: '#888', fontSize: 13 }}>共{count}个</span>
        )}
      </Flexbox>
    </>
  );
});
export default TopicGroupItem;
