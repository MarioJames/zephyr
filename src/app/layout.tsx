import type { Metadata } from 'next';
import { OIDCInitializer } from '@/components/OIDCInitializer';

export const metadata: Metadata = {
  title: '保险客户管理系统',
  description: '保险客户管理系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh'>
      <body>
        <OIDCInitializer />
        {children}
      </body>
    </html>
  );
}
