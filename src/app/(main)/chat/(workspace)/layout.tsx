import { ReactNode } from 'react';

import Desktop from './_layout';

interface LayoutProps {
  children: ReactNode;
  session: ReactNode;
  conversation: ReactNode;
}

export default function Layout({
  children,
  session,
  conversation,
}: LayoutProps) {
  return (
    <Desktop session={session} conversation={conversation}>
      {children}
    </Desktop>
  );
}
