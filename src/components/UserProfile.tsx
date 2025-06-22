'use client';

import React from 'react';
import { Card, Avatar, Descriptions, Button, Space, Spin, Alert } from 'antd';
import { UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useOIDC } from '@/hooks/useOIDC';

/**
 * 用户信息展示组件
 * 展示 OIDC 基础信息 + 业务详细信息
 */
export const UserProfile: React.FC = () => {
  const {
    isAuthenticated,
    isLoadingUserInfo,
    userInfo,
    loadUserInfo,
    error,
  } = useOIDC();

  if (!isAuthenticated) {
    return null;
  }

  // 显示信息
  const displayName = userInfo?.fullName || userInfo?.username || userInfo?.email || '未知用户';
  const displayEmail = userInfo?.email;

  return (
    <Card
      title="用户信息"
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={loadUserInfo}
          loading={isLoadingUserInfo}
          size="small"
        >
          刷新用户信息
        </Button>
      }
      style={{ width: '100%', maxWidth: 600 }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
        {/* 基本信息 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} icon={<UserOutlined />} />
          <div>
            <h3 style={{ margin: 0 }}>{displayName}</h3>
            {displayEmail && <p style={{ margin: 0, color: '#666' }}>{displayEmail}</p>}
          </div>
        </div>

        {/* 加载状态 */}
        {isLoadingUserInfo && (
          <Alert message="正在加载用户信息..." type="info" showIcon />
        )}

        {/* 错误提示 */}
        {error && !isLoadingUserInfo && (
          <Alert
            message="加载用户信息失败"
            description={error.message}
            type="warning"
            showIcon
            closable
          />
        )}

        {/* 详细信息 */}
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="用户ID">
            {userInfo?.id}
          </Descriptions.Item>
          
          <Descriptions.Item label="姓名">
            {displayName}
          </Descriptions.Item>
          
          <Descriptions.Item label="邮箱">
            {displayEmail || '未提供'}
          </Descriptions.Item>
          
          {/* 用户详细信息 */}
          {userInfo?.firstName && (
            <Descriptions.Item label="名">
              {userInfo.firstName}
            </Descriptions.Item>
          )}
          
          {userInfo?.lastName && (
            <Descriptions.Item label="姓">
              {userInfo.lastName}
            </Descriptions.Item>
          )}
          
          {userInfo?.phone && (
            <Descriptions.Item label="电话">
              {userInfo.phone}
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* 开发调试 */}
        {process.env.NODE_ENV === 'development' && (
          <details>
            <summary>调试信息</summary>
            <pre style={{ fontSize: '12px', marginTop: '8px' }}>
              {JSON.stringify({ userInfo }, null, 2)}
            </pre>
          </details>
        )}
      </Space>
    </Card>
  );
};