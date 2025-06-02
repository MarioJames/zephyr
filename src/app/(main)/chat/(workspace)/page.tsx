import { DynamicLayoutProps } from '@/types/next';
import PageTitle from '../features/PageTitle';

export const generateMetadata = async (props: DynamicLayoutProps) => {
  // TODO: implement metadata generation
};

const Page = async (props: DynamicLayoutProps) => {
  return (
    <>
      <PageTitle />
    </>
  );
};

Page.displayName = 'Chat';

export default Page;
