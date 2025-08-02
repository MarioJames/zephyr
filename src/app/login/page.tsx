'use client';

import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Login() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // 获取 callbackUrl 参数，如果没有则默认跳转到首页
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    
    // 重定向到 oidc登录页，并传递 callbackUrl
    signIn('oidc', { 
      callbackUrl: decodeURIComponent(callbackUrl),
      redirect: true 
    });
  }, [searchParams]);

  return null;
}
