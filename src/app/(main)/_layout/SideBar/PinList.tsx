import { Avatar, Tooltip } from '@lobehub/ui';
import { Divider } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsBoolean, useQueryState } from 'nuqs';
import { Flexbox } from 'react-layout-kit';
import { useSwitchSession } from '@/hooks/useSwitchSession';
import { sessionHelpers, sessionSelectors, useSessionStore } from '@/store/session';

const HANDLER_WIDTH = 4;

const useStyles = createStyles(({ css, token }) => ({
  ink: css`
    &::before {
      content: '';

      position: absolute;
      inset-block-start: 50%;
      inset-inline: -9px;
      transform: translateY(-50%);

      width: 0;
      height: 8px;
      border-start-end-radius: ${HANDLER_WIDTH}px;
      border-end-end-radius: ${HANDLER_WIDTH}px;

      opacity: 0;
      background: ${token.colorPrimary};

      transition:
        height 150ms ${token.motionEaseInOut},
        width 150ms ${token.motionEaseInOut},
        opacity 200ms ${token.motionEaseInOut};
    }

    &:hover {
      &::before {
        width: ${HANDLER_WIDTH}px;
        height: 24px;
        opacity: 1;
      }
    }
  `,
  inkActive: css`
    &::before {
      width: ${HANDLER_WIDTH}px;
      height: 40px;
      opacity: 1;
    }

    &:hover {
      &::before {
        width: ${HANDLER_WIDTH}px;
        height: 40px;
        opacity: 1;
      }
    }
  `,
}));

const PinList = () => {
  const { styles, cx } = useStyles();
  const list = useSessionStore(sessionSelectors.pinnedSessions);
  const [activeId] = useSessionStore((s) => [s.currentSessionId]);
  const switchSession = useSwitchSession();
  const hasList = list.length > 0;
  const [isPinned, setPinned] = useQueryState('pinned', parseAsBoolean);

  const switchAgent = (id: string) => {
    switchSession(id);
    setPinned(true);
  };

  return (
    hasList && (
      <>
        <Divider style={{ marginBottom: 8, marginTop: 4 }} />
        <Flexbox flex={1} gap={12} height={'100%'}>
          {list.slice(0, 9).map((item, index) => (
            <Flexbox key={item.id} style={{ position: 'relative' }}>
              <Tooltip
                placement={'right'}
                title={sessionHelpers.formatSessionTitle(item)}
              >
                <Flexbox
                  className={cx(
                    styles.ink,
                    isPinned && activeId === item.id ? styles.inkActive : undefined,
                  )}
                >
                  <Avatar
                    avatar={sessionHelpers.getSessionAvatar(item)}
                    background={sessionHelpers.getSessionColor(item)}
                    onClick={() => {
                      switchAgent(item.id);
                    }}
                    size={40}
                  />
                </Flexbox>
              </Tooltip>
            </Flexbox>
          ))}
        </Flexbox>
      </>
    )
  );
};

export default PinList;
