import { createStyles } from 'antd-style';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { GroupedTopic } from '@/types/topic';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    color: ${token.colorTextQuaternary};
    background: ${token.colorBgContainerSecondary};
    box-shadow: 0 3px 4px -2px ${token.colorBgContainerSecondary};
  `,
}));

const TopicGroupItem = memo<Omit<GroupedTopic, 'children'>>(({ title }) => {
  const { styles } = useStyles();

  return (
    <Flexbox className={styles.container} paddingBlock={'12px 8px'} paddingInline={12}>
      {title}
    </Flexbox>
  );
});
export default TopicGroupItem;
