import { ReactNode } from 'react';

export interface LayoutProps {
  children?: React.ReactNode;
  session?: React.ReactNode;
  conversation?: React.ReactNode;
  portal?: React.ReactNode;
}
