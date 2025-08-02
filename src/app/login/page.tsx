'use client';

import BubblesLoading from "@/components/Loading/BubblesLoading";
import { Suspense } from 'react';

import Client from './Client';

export default function Login() {

  return (
    <Suspense fallback={<BubblesLoading />}>
      <Client />
    </Suspense>
  );
}
