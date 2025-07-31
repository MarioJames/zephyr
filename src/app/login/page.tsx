'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function Login() {
  // 重定向到 oidc登录页
  useEffect(() => {
    signIn('oidc', { redirect: true });
  }, []);

  return null;
}
