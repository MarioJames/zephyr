import React, { Suspense, lazy } from 'react';

import Loading from '@/components/BrandTextLoading';
import { DynamicLayoutProps } from '@/types/next';

import Desktop from './_layout/Desktop';

const PortalBody = lazy(() => import('@/features/Portal/router'));

const Inspector = async (props: DynamicLayoutProps) => {

  const Layout = Desktop;

  return (
    <Suspense fallback={<Loading />}>
      <Layout>
        <PortalBody />
      </Layout>
    </Suspense>
  );
};

Inspector.displayName = 'ChatInspector';

export default Inspector;
