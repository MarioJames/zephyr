import FileDetail from './FileDetail';
import FilePreview from './FilePreview';
import FullscreenModal from './FullscreenModal';

interface PageProps<Params, SearchParams = undefined> {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

type PagePropsWithId = PageProps<{ id: string }>;

const Page = async (props: PagePropsWithId) => {
  const params = await props.params;
  console.log('params', params);

  return (
    <FullscreenModal detail={<FileDetail id={params.id} />}>
      <FilePreview id={params.id} />
    </FullscreenModal>
  );
};

export default Page;
