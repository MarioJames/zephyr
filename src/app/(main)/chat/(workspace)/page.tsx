import StructuredData from '@/components/StructuredData';
import { ldModule } from '@/server/ld';
import { metadataModule } from '@/server/metadata';
import { DynamicLayoutProps } from '@/types/next';

import PageTitle from '../features/PageTitle';

export const generateMetadata = async (props: DynamicLayoutProps) => {
  return metadataModule.generate({
    description: '测试描述',
    title: '测试标题',
    url: '/chat',
  });
};

const Page = async (props: DynamicLayoutProps) => {
  const ld = ldModule.generate({
    description: '测试描述',
    title: '测试标题',
    url: '/chat',
  });

  return (
    <>
      <StructuredData ld={ld} />
      <PageTitle />
    </>
  );
};

Page.displayName = 'Chat';

export default Page;
