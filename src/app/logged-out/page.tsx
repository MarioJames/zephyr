'use client';
import { Suspense } from 'react';
import Client from './client';
import BubblesLoading from '@/components/Loading/BubblesLoading';

export default function LoggedOut() {
  return (
    <Suspense fallback={<BubblesLoading />}>
      <Client />
    </Suspense>
  );
}
