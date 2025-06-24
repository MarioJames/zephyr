import { ResolvingViewport } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import GlobalProvider from '@/layout/GlobalProvider';
import { OIDCInitializer } from '@/components/OIDCInitializer';
import SystemStatusInitializer from '@/components/SystemStatusInitializer';
import type { Metadata } from 'next';
import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/routeVariants';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '保险客户管理系统',
  description: '保险客户管理系统',
};
interface RootLayoutProps extends DynamicLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}
const inVercel = process.env.VERCEL === '1';

const RootLayout = async ({ children, params, modal }: RootLayoutProps) => {
  const { variants } = await params;
  const { locale, theme, primaryColor, neutralColor } =
    RouteVariants.deserializeVariants(variants);
  return (
    <html lang='zh'>
      <body>
        <OIDCInitializer />
        <NuqsAdapter>
          <GlobalProvider
            appearance={theme}
            locale={locale}
            neutralColor={neutralColor}
            primaryColor={primaryColor}
          >
            <SystemStatusInitializer />
            {children}
            {modal}
          </GlobalProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
};

export default RootLayout;

export const generateViewport = async (): Promise<ResolvingViewport> => {
  return {
    initialScale: 1,
    minimumScale: 1,
    themeColor: [
      { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
      { color: '#000', media: '(prefers-color-scheme: dark)' },
    ],
    viewportFit: 'cover',
    width: 'device-width',
  };
};

export const generateStaticParams = () => {
  const variants: { variants: string }[] = [];
  return variants;
};
