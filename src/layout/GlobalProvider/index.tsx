import { ReactNode, Suspense } from 'react';

import { appEnv } from '@/config/app';

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
  locale: userLocale,
  appearance,
}: GlobalLayoutProps) => {
  return (
    <StyleRegistry>
      <AppTheme
        customFontFamily={appEnv.CUSTOM_FONT_FAMILY}
        customFontURL={appEnv.CUSTOM_FONT_URL}
        defaultAppearance={appearance}
        defaultNeutralColor={neutralColor as any}
        defaultPrimaryColor={primaryColor as any}
        globalCDN={appEnv.CDN_USE_GLOBAL}
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
