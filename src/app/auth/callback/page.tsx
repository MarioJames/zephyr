'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userManager } from '@/config/oidc';
import { useOIDCStore } from '@/store/oidc';
import { Spin, Alert } from 'antd';
// 移除调试工具导入

export default function CallbackPage() {
  const router = useRouter();
  const { setUser, setError, setLoading } = useOIDCStore();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      console.log('OIDC: Processing callback', window.location.href);

      if (!userManager) {
        setStatus('error');
        setErrorMessage('OIDC 客户端未初始化');
        const error = new Error('OIDC client not initialized');
        setError(error);
        return;
      }

      try {
        setLoading(true);
        console.log('OIDC: Processing callback');

        // 处理认证回调
        const user = await userManager.signinRedirectCallback();

        if (user && user.access_token) {
          console.log('OIDC: Callback successful, user authenticated', user.profile);
          setUser(user);
          setStatus('success');

          // 认证成功

          // 延迟 1 秒后重定向，让用户看到成功信息
          setTimeout(() => {
            // 检查是否有回调前的页面信息
            const returnUrl = sessionStorage.getItem('oidc_return_url') || '/';
            sessionStorage.removeItem('oidc_return_url');
            router.replace(returnUrl);
          }, 1000);
        } else {
          throw new Error('认证成功但未获得有效的访问令牌');
        }
      } catch (error) {
        console.error('OIDC: Callback error', error);
        setStatus('error');
        const message = error instanceof Error ? error.message : '认证过程中发生未知错误';
        setErrorMessage(message);
        const errorObj = error instanceof Error ? error : new Error(message);
        setError(errorObj);

        // 错误处理完成
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, setUser, setError, setLoading]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <Spin size="large" className="mb-4" />
            <h1 className="text-2xl font-bold mb-4">处理登录中...</h1>
            <p className="text-gray-600">请稍候，正在完成认证流程</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-4 text-green-600">登录成功！</h1>
            <p className="text-gray-600">正在跳转到应用...</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h1 className="text-2xl font-bold mb-4 text-red-600">登录失败</h1>
            <Alert
              message="认证错误"
              description={errorMessage}
              type="error"
              showIcon
              className="mb-4 text-left"
            />
            <p className="text-gray-600 text-sm">3 秒后自动跳转到登录页...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
}
