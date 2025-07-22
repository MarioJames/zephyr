import { ReactNode, Suspense } from 'react';

import AntdV5MonkeyPatch from './AntdV5MonkeyPatch';
import AppTheme from './AppTheme';
import QueryProvider from './Query';
import ReactScan from './ReactScan';
import StyleRegistry from './StyleRegistry';

interface GlobalLayoutProps {
  appearance: string;
  children: ReactNode;
  locale: string;
  neutralColor?: string;
  primaryColor?: string;
}

const GlobalLayout = async ({
  children,
  neutralColor,
  primaryColor,
  appearance,
}: GlobalLayoutProps) => {
  return (
    <StyleRegistry>
      <AppTheme
        defaultAppearance={appearance}
        defaultNeutralColor={neutralColor as any}
        defaultPrimaryColor={primaryColor as any}
      >
          <QueryProvider>{children}</QueryProvider>
          <Suspense>
            <ReactScan />
          </Suspense>
      </AppTheme>
      <AntdV5MonkeyPatch />
    </StyleRegistry>
  );
};

export default GlobalLayout;
