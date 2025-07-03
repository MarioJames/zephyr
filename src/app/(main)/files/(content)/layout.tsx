import Desktop from './_layout/Desktop';
import { LayoutProps } from './_layout/type';

const Layout = Desktop;

Layout.displayName = 'FileLayout';

export default (props: LayoutProps) => {

  return <Layout {...props} />;
};
