'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Alert, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useOIDC } from '@/hooks/useOIDC';

const { Title, Text } = Typography;

/**
 * 应用默认根路径页面
 * 负责初始化认证检查和路由重定向
 */
export default function HomePage() {
  const router = useRouter();

  const {
    isAuthenticated,
    isLoading,
    userInfo,
    tokenInfo,
    error,
    login,
    getValidAccessToken,
  } = useOIDC();

  useEffect(() => {
    const handleAuth = async () => {
      // 等待OIDC初始化完成
      if (isLoading) {
        return;
      }

      // 如果有错误，清理后重新登录
      if (error) {
        console.warn('OIDC认证错误，将重新登录:', error.message);
        await login();
        return;
      }

      // 如果已认证，检查token有效性
      if (isAuthenticated && userInfo) {
        try {
          // 尝试获取有效的access token，这会自动检查过期并刷新
          const validToken = await getValidAccessToken();

          if (validToken) {
            console.log('认证成功，重定向到聊天页面');
            router.replace('/chat');
          } else {
            console.warn('无法获取有效token，重新登录');
            await login();
          }
        } catch (error) {
          console.error('Token验证失败，重新登录:', error);
          await login();
        }
      } else {
        // 未认证，执行登录
        console.log('用户未认证，开始登录流程');
        await login();
      }
    };

    handleAuth();
  }, [isAuthenticated, isLoading, userInfo, error, router, login, getValidAccessToken]);

  // 渲染加载状态
  const renderLoadingState = () => {
    let message = '正在初始化...';
    let description = '正在检查认证状态';

    if (isLoading) {
      message = '正在验证身份...';
      description = '请稍候，正在处理认证信息';
    } else if (isAuthenticated && userInfo) {
      message = '认证成功！';
      description = '正在跳转到应用主页面';
    } else if (error) {
      message = '认证失败';
      description = '正在重新登录，请稍候...';
    } else {
      message = '准备登录';
      description = '正在跳转到登录页面';
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg min-w-[400px]">
          {/* Logo或应用名称 */}
          <div className="mb-6">
            <Title level={2} className="text-blue-600 mb-2">
              保险客户管理系统
            </Title>
            <Text type="secondary">
              Insurance Customer Management System
            </Text>
          </div>

          {/* 加载状态 */}
          <div className="mb-6">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
              size="large"
            />
          </div>

          {/* 状态信息 */}
          <div className="space-y-3">
            <Title level={4} className="text-gray-700 mb-2">
              {message}
            </Title>
            <Text type="secondary">
              {description}
            </Text>

            {/* 用户信息显示 */}
            {isAuthenticated && userInfo && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <Text className="text-green-700">
                  欢迎回来，{userInfo.fullName || userInfo.username || userInfo.email || '用户'}！
                </Text>
              </div>
            )}

            {/* 错误信息显示 */}
            {error && (
              <Alert
                message="认证异常"
                description="系统将自动重新登录，请稍候..."
                type="warning"
                showIcon
                className="mt-4"
              />
            )}
          </div>

          {/* Token状态信息（开发环境显示） */}
          {process.env.NODE_ENV === 'development' && tokenInfo && (
            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-left">
              <Text type="secondary" className="text-xs">
                <div>Token过期时间: {new Date(tokenInfo.expiresAt * 1000).toLocaleString()}</div>
                <div>剩余时间: {Math.max(0, Math.floor((tokenInfo.expiresAt * 1000 - Date.now()) / 1000))}秒</div>
              </Text>
            </div>
          )}
        </div>
      </div>
    );
  };

  return renderLoadingState();
}
