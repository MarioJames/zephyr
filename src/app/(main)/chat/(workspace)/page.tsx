import { Suspense } from 'react';
import { DynamicLayoutProps } from '@/types/next';
import PageTitle from '../features/PageTitle';
import Changelog from './features/ChangelogModal';

export const generateMetadata = async (props: DynamicLayoutProps) => {
  // TODO: implement metadata generation
};

const Page = async (props: DynamicLayoutProps) => {
  return (
    <>
      <PageTitle />
        <Suspense>
          <Changelog />
        </Suspense>
    </>
  );
};

Page.displayName = 'Chat';

export default Page;
