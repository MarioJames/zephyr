import Desktop from './_layout/Desktop';
import { LayoutProps } from './_layout/type';

const Layout = Desktop;

Layout.displayName = 'FileLayout';

const FileContentLayout = (props: LayoutProps) => {
  return <Layout {...props} />;
};

FileContentLayout.displayName = 'FileContentLayout';

export default FileContentLayout;
