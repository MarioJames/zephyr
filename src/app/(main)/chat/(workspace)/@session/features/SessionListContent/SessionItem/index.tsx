import { createStyles } from 'antd-style';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useSessionStore } from '@/store/session';
import { useGlobalStore } from '@/store/global';

import SessionContent from './SessionContent';

const useStyles = createStyles(({ css, token, isDarkMode }) => ({
  active: css`
    background: ${isDarkMode
      ? token.colorFillSecondary
      : token.colorFillTertiary};
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
  user?: { fullName?: string; username?: string };
  avatar?: string;
}

const SessionItem = memo<ConfigCellProps>(
  ({ title, active, id, isRecent, user, avatar }) => {
    const { styles, cx } = useStyles();
    const [activeSessionId, switchSession] = useSessionStore((s) => [
      s.activeSessionId,
      s.switchSession,
    ]);
    const [isHover, setHovering] = useState(false);
    const toggleSlotPanel = useGlobalStore((s) => s.toggleSlotPanel);
    const showSlotPanel = useGlobalStore((s) => s.status.showSlotPanel);

    return (
      <Flexbox style={{ position: 'relative' }}>
        <Flexbox
          align={'center'}
          className={cx(
            styles.container,
            'topic-item',
            active && styles.active
          )}
          distribution={'space-between'}
          horizontal
          onClick={() => {
            if (activeSessionId !== id) {
              switchSession(id);

              if (!showSlotPanel) {
                toggleSlotPanel(true);
              }
            }
          }}
          onMouseEnter={() => {
            setHovering(true);
          }}
          onMouseLeave={() => {
            setHovering(false);
          }}
        >
          <SessionContent
            avatar={avatar}
            employeeName={user?.fullName || user?.username}
            id={id}
            isRecent={isRecent}
            showMore={isHover}
            title={title}
          />
        </Flexbox>
      </Flexbox>
    );
  }
);

SessionItem.displayName = 'SessionItem';

export default SessionItem;
