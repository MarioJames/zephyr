'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userManager } from '@/config/oidc';
import { useOIDCStore } from '@/store/oidc';
import { Icon } from '@lobehub/ui';
import { XCircle } from 'lucide-react';
import { Alert, Typography } from 'antd';
import { Center, Flexbox } from 'react-layout-kit';
import { useTheme } from 'antd-style';
import Initializing from '@/components/Initializing';

const { Title, Text } = Typography;

export default function CallbackPage() {
  const router = useRouter();
  const theme = useTheme();
  const { setUser, setError, setLoading } = useOIDCStore();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');
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
          console.log(
            'OIDC: Callback successful, user authenticated',
            user.profile
          );
          setUser(user);

          // 认证成功，处理返回地址
          const returnUrl = sessionStorage.getItem('oidc_return_url');
          sessionStorage.removeItem('oidc_return_url');

          // 如果有有效的返回地址且不是根路径，跳转到返回地址
          // 否则跳转到默认的聊天页面
          const finalUrl = returnUrl && returnUrl !== '/' ? returnUrl : '/chat';

          console.log('OIDC Callback: 认证成功，跳转到', finalUrl);
          router.replace(finalUrl);
        } else {
          throw new Error('认证成功但未获得有效的访问令牌');
        }
      } catch (error) {
        console.error('OIDC: Callback error', error);
        setStatus('error');
        const message =
          error instanceof Error ? error.message : '认证过程中发生未知错误';
        setErrorMessage(message);
        const errorObj = error instanceof Error ? error : new Error(message);
        setError(errorObj);

        // 错误后 3 秒自动跳转到聊天页面
        setTimeout(() => {
          router.replace('/chat');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [router, setUser, setError, setLoading]);

  // 如果是处理中状态，直接使用统一的加载组件
  if (status === 'processing') {
    return <Initializing />;
  }

  // 如果是错误状态，显示错误信息
  if (status === 'error') {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: theme.colorBgLayout,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: theme.colorBgContainer,
            padding: 48,
            borderRadius: theme.borderRadius,
            boxShadow: theme.boxShadow,
            minWidth: 320,
            maxWidth: 400,
          }}
        >
          <Center gap={24}>
            <Icon
              icon={XCircle}
              size='large'
              style={{ color: theme.colorError, fontSize: 48 }}
            />
            <Flexbox gap={16} align='center'>
              <Title level={3} style={{ margin: 0, color: theme.colorError }}>
                登录失败
              </Title>
              <Alert
                message='认证错误'
                description={errorMessage}
                type='error'
                showIcon
                style={{ textAlign: 'left' }}
              />
              <Text type='secondary' style={{ fontSize: 12 }}>
                3 秒后自动跳转到登录页...
              </Text>
            </Flexbox>
          </Center>
        </div>
      </div>
    );
  }

  // 正常情况下不应该到达这里，显示加载状态
  return <Initializing />;
}
