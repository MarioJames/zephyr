import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { GroupedTopic } from '@/types/topic';

const preformat = (id: string) =>
  id.startsWith('20') ? (id.includes('-') ? dayjs(id).format('MMMM') : id) : undefined;

const useStyles = createStyles(({ css, token, responsive }) => ({
  container: css`
    color: ${token.colorTextQuaternary};
    background: ${token.colorBgContainerSecondary};
    box-shadow: 0 3px 4px -2px ${token.colorBgContainerSecondary};

  `,
}));

const TopicGroupItem = memo<Omit<GroupedTopic, 'children'>>(({ id, title }) => {
  const { styles } = useStyles();
  let timeTitleZh = preformat(id);
  if (!timeTitleZh) {
    if (id === 'month') timeTitleZh = '本月';
    else if (id === 'today') timeTitleZh = '今天';
    else if (id === 'week') timeTitleZh = '本周';
    else if (id === 'yesterday') timeTitleZh = '昨天';
    else timeTitleZh = id;
  }

  return (
    <Flexbox className={styles.container} paddingBlock={'12px 8px'} paddingInline={12}>
      {title ? title : timeTitleZh}
    </Flexbox>
  );
});
export default TopicGroupItem;
