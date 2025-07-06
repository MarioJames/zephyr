interface PageProps<Params, SearchParams = undefined> {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

type PagePropsWithId = PageProps<{ hashId: string }>;

import FileDetail from './FileDetail';
import FilePreview from './FilePreview';
import FullscreenModal from './FullscreenModal';

const Page = async (props: PagePropsWithId) => {
  const params = await props.params;
  console.log('params', params);

  return (
    <FullscreenModal detail={<FileDetail hashId={params.hashId} />}>
      <FilePreview hashId={params.hashId} />
    </FullscreenModal>
  );
};

export default Page;
