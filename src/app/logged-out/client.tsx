'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Client() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (!error) {
      // Clear NextAuth session and return to home page
      signOut({ redirect: true, callbackUrl: '/' });
    }
  }, [error]);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h3>登出回调校验失败</h3>
        <p>state 不一致，已阻止本地会话清理。</p>
      </div>
    );
  }

  return null;
}
