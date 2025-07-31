import { ReactNode } from 'react';

export interface LayoutProps {
  children?: ReactNode;
  session?: ReactNode;
  conversation?: ReactNode;
  portal?: ReactNode;
}
