import { createStyles } from 'antd-style';
import Link from 'next/link';
import { memo } from 'react';
import LazyLoad from 'react-lazy-load';

import { SESSION_CHAT_URL } from '@/const/url';
import { useSwitchSession } from '@/hooks/useSwitchSession';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
import { LobeAgentSession } from '@/types/session';

import SkeletonList from '../../SkeletonList';
import AddButton from './AddButton';
import SessionItem from './Item';

const useStyles = createStyles(
  ({ css }) => css`
    min-height: 70px;
  `,
);
interface SessionListProps {
  dataSource?: LobeAgentSession[];
  groupId?: string;
  showAddButton?: boolean;
}
const SessionList = memo<SessionListProps>(({ dataSource, groupId, showAddButton = true }) => {
  const { styles } = useStyles();

  // const isInit = useSessionStore(sessionSelectors.isSessionListInit);
  const isInit = false;

  const switchSession = useSwitchSession();

  const isEmpty = !dataSource || dataSource.length === 0;
  console.log('aaa',isEmpty,isInit)
  return !isInit ? (
    <SkeletonList />
  ) : !isEmpty ? (
    dataSource.map(({ id }) => (
      <LazyLoad className={styles} key={id}>
        <Link
          aria-label={id}
          href={SESSION_CHAT_URL(id)}
          onClick={(e) => {
            e.preventDefault();
            switchSession(id);
          }}
        >
          <SessionItem id={id} />
        </Link>
      </LazyLoad>
    ))
  ) : (
    showAddButton && <AddButton />
  );
});

export default SessionList;
