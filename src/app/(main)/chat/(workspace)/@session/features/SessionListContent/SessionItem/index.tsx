import { createStyles } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSessionStore } from '@/store/session';

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
  isRecent?: boolean;
}

const SessionItem = memo<ConfigCellProps>(({ title, active, id, isRecent }) => {
  const { styles, cx } = useStyles();
  const [switchSession] = useSessionStore((s) => [s.switchSession]);
  const [isHover, setHovering] = useState(false);

  return (
    <Flexbox style={{ position: 'relative' }}>
      <Flexbox
        align={'center'}
        className={cx(styles.container, 'topic-item', active && styles.active)}
        distribution={'space-between'}
        horizontal
        onClick={() => {
          switchSession(id);
        }}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
          <SessionContent id={id} showMore={isHover} title={title} isRecent={isRecent} />
      </Flexbox>
    </Flexbox>
  );
});

export default SessionItem;
