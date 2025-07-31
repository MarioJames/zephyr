import { ResolvingViewport } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import GlobalProvider from '@/layout/GlobalProvider';
import SystemStatusInitializer from '@/components/SystemStatusInitializer';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/locale/zh_CN';
import type { Metadata } from 'next';
import { DynamicLayoutProps } from '@/types/next';
import { RouteVariants } from '@/utils/routeVariants';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: '保险客户管理系统',
  description: '保险客户管理系统',
};
interface RootLayoutProps extends DynamicLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const RootLayout = async ({ children, params, modal }: RootLayoutProps) => {
  const { variants } = await params;
  const { locale, theme, primaryColor, neutralColor } =
    RouteVariants.deserializeVariants(variants);

  // 获取主题相关的类名
  const themeClass = theme === 'dark' ? 'dark' : '';

  return (
    <html className={themeClass} lang='zh'>
      <body>
        <SessionProvider>
          <NuqsAdapter>
            <ConfigProvider locale={zh_CN}>
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
            </ConfigProvider>
          </NuqsAdapter>
        </SessionProvider>
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
