import { CollapseProps } from 'antd';
import isEqual from 'fast-deep-equal';
import { memo, useMemo } from 'react';

import { useFetchSessions } from '@/hooks/useFetchSessions';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';

import SessionList from './List';

const DefaultMode = memo(() => {


  useFetchSessions();

  const defaultSessions = useSessionStore(sessionSelectors.defaultSessions, isEqual);

  const items = useMemo(
    () =>
      [
        {
          children: <SessionList dataSource={defaultSessions || []} />,
          key: 'default',
          label: "默认列表",
        },
      ].filter(Boolean) as CollapseProps['items'],
    [defaultSessions],
  );

  return (
    <>
    </>
  );
});

DefaultMode.displayName = 'SessionDefaultMode';

export default DefaultMode;
