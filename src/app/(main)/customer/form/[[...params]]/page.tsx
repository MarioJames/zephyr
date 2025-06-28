'use client';

import React from 'react';
import { Spin } from 'antd';
import CustomerForm from './CustomerForm';
import { useCustomerForm } from './useCustomerForm';

interface CustomerFormPageProps {
  params: {
    params?: string[];
  };
}

export default function CustomerFormPage({ params }: CustomerFormPageProps) {
  const {
    mode,
    initialData,
    agents,
    loading,
    error,
    handleSubmit,
    handleCancel
  } = useCustomerForm({ params: params?.params });

  // 加载状态
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size='large' tip='加载数据中...' />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '16px', color: '#ff4d4f' }}>{error}</div>
        <button
          onClick={handleCancel}
          style={{
            padding: '8px 16px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          返回客户管理
        </button>
      </div>
    );
  }

  // 渲染表单
  return (
    <CustomerForm
      mode={mode}
      initialData={initialData}
      agents={agents}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
