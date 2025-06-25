import { createStyles } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useChatStore } from '@/store/chat';

import SessionContent from './SessionContent';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  active: css`
    background: ${isDarkMode ? token.colorFillSecondary : token.colorFillTertiary};
    transition: background 200ms ${token.motionEaseOut};

    &:hover {
      background: ${token.colorFill};
    }
  `,
  container: css`
    cursor: pointer;

    margin-block: 2px;
    margin-inline: 8px;
    padding: 8px;
    border-radius: ${token.borderRadius}px;

    &.topic-item {
      width: calc(100% - 16px);
    }

    &:hover {
      background: ${token.colorFillSecondary};
    }
  `,
  split: css`
    border-block-end: 1px solid ${token.colorSplit};
  `,
}));

export interface ConfigCellProps {
  active?: boolean;
  id: string;
  title: string;
}

const SessionItem = memo<ConfigCellProps>(({ title, active, id }) => {
  const { styles, cx } = useStyles();
  const [toggleTopic] = useChatStore((s) => [s.switchTopic]);
  const [isHover, setHovering] = useState(false);

  return (
    <Flexbox style={{ position: 'relative' }}>
      <Flexbox
        align={'center'}
        className={cx(styles.container, 'topic-item', active && styles.active)}
        distribution={'space-between'}
        horizontal
        onClick={() => {
          toggleTopic(id);
        }}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
          <SessionContent id={id} showMore={isHover} title={title} />
      </Flexbox>
    </Flexbox>
  );
});

export default SessionItem;
