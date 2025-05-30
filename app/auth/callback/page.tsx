'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userManager } from '../../config/oidc';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await userManager!.signinRedirectCallback();
        router.push('/');
      } catch (error) {
        console.error('Error handling callback:', error);
        router.push('/?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">处理登录中...</h1>
        <p className="text-gray-600">请稍候，正在完成认证流程</p>
      </div>
    </div>
  );
}
