import { Suspense, lazy } from 'react';

import CircleLoading from '@/components/CircleLoading';
import { DynamicLayoutProps } from '@/types/next';

import Desktop from './_layout/Desktop';
import SessionHydration from './features/SessionHydration';
import SkeletonList from './features/SkeletonList';

const SessionListContent = lazy(() => import('./features/SessionListContent'));

const Session = (props: DynamicLayoutProps) => {
  return (
    <Suspense fallback={<CircleLoading />}>
      <Desktop {...props}>
        <Suspense fallback={<SkeletonList />}>
          <SessionListContent />
        </Suspense>
      </Desktop>
      <SessionHydration />
    </Suspense>
  );
};

Session.displayName = 'Session';

export default Session;
