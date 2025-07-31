'use client';

import React, { use } from 'react';
import { Form } from 'antd';
import CustomerForm, { CustomerFormData } from './CustomerForm';
import { useCustomerForm } from './useCustomerForm';
import { useSharedStyles } from './features/shared/styles';
import Header from './features/Header';
import FormSkeleton from './features/FormSkeleton';
import ErrorCapture from '@/components/ErrorCapture';

interface CustomerFormPageProps {
  params: Promise<{
    params?: string[];
  }>;
}

export default function CustomerFormPage({ params }: CustomerFormPageProps) {
  const { styles } = useSharedStyles();

  const urlParams = use(params);

  const [form] = Form.useForm<CustomerFormData>();

  const {
    mode,
    agents,
    loading,
    error,
    handleSubmit,
    handleCancel,
    submitLoading,
  } = useCustomerForm({ params: urlParams?.params, form: form });

  // 渲染表单
  return (
    <div className={styles.pageContainer}>
      {/* 顶部返回导航 */}
      <Header onCancel={handleCancel} />
      {loading ? (
        <FormSkeleton />
      ) : error ? (
        <ErrorCapture reset={handleCancel} />
      ) : (
        <CustomerForm
          agents={agents}
          form={form}
          mode={mode}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLoading={submitLoading}
        />
      )}
    </div>
  );
}
