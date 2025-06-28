'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, message } from 'antd';
import CustomerForm from './CustomerForm';
import { type CustomerFormData } from '@/types/customer-form';
import { useCustomerStore } from '@/store/customer';
import { customerItemToFormData, formDataToCreateRequest, formDataToUpdateRequest, getAgentIdByType } from './utils';

interface CustomerFormPageProps {
  params: {
    params?: string[];
  };
}

export default function CustomerFormPage({ params }: CustomerFormPageProps) {
  const router = useRouter();
  const routeParams = params?.params;

  // Customer store hooks
  const {
    currentCustomer,
    loading,
    error,
    agents,
    fetchCustomerDetail,
    createCustomer,
    updateCustomer,
    fetchAgents,
    clearError,
    setCurrentCustomer
  } = useCustomerStore();

  // 路由验证和数据加载
  useEffect(() => {
    const validateAndLoadData = async () => {
      // 清除之前的错误状态
      clearError();

      // 如果没有参数或参数为空，默认为创建模式
      if (!routeParams || routeParams.length === 0) {
        // 创建模式，清除当前客户数据
        setCurrentCustomer(undefined);
        // 确保agents数据已加载
        if (agents.length === 0) {
          await fetchAgents();
        }
        return;
      }

      const [actionType, customerId] = routeParams;

      // 验证路由格式
      if (actionType === 'create') {
        // 新增模式，清除当前客户数据
        setCurrentCustomer(undefined);
        // 确保agents数据已加载
        if (agents.length === 0) {
          await fetchAgents();
        }
        return;
      }

      if (actionType === 'edit' && customerId) {
        // 编辑模式，加载客户数据
        try {
          await fetchCustomerDetail(customerId);
          // 确保agents数据已加载
          if (agents.length === 0) {
            await fetchAgents();
          }
        } catch (err) {
          console.error('加载客户数据失败:', err);
          // 错误已经在store中设置，这里不需要额外处理
        }
        return;
      }

      // 无效的路由格式，可以重定向到创建页面
      router.replace('/customer/form');
    };

    validateAndLoadData();
  }, [routeParams, clearError, setCurrentCustomer, fetchCustomerDetail, fetchAgents, agents.length, router]);

  // 处理表单提交
  const handleSubmit = async (
    data: CustomerFormData & { type: string; avatar?: string }
  ) => {
    try {
      const isEdit = routeParams?.[0] === 'edit';
      const customerId = isEdit ? routeParams?.[1] : undefined;

      if (isEdit && customerId) {
        // 编辑模式
        const updateData = formDataToUpdateRequest(data);
        // 设置agentId
        updateData.agentId = getAgentIdByType(data.type, agents);

        await updateCustomer(customerId, updateData);
        message.success('客户信息更新成功！');
      } else {
        // 新增模式
        const createData = formDataToCreateRequest(data);
        // 设置agentId
        createData.agentId = getAgentIdByType(data.type, agents);

        await createCustomer(createData);
        message.success('客户添加成功！');
      }

      // 成功后跳转到客户管理页面
      router.push('/customer');
    } catch (error) {
      // 错误已经在store中处理，这里只需要显示通用错误消息
      const isEdit = routeParams?.[0] === 'edit';
      message.error(isEdit ? '更新客户失败，请重试' : '添加客户失败，请重试');
      console.error('操作失败:', error);
      throw error;
    }
  };

  // 处理取消操作
  const handleCancel = () => {
    router.push('/customer');
  };

  // 路由解析
  const actionType = routeParams?.[0] || 'create'; // 默认为创建模式
  const customerId = routeParams?.[1];

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
        <Spin size='large' tip='加载客户数据中...' />
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
  if (actionType === 'create') {
    return (
      <CustomerForm
        mode='create'
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  if (actionType === 'edit' && customerId) {
    const initialData = currentCustomer ? customerItemToFormData(currentCustomer) : undefined;
    return (
      <CustomerForm
        mode='edit'
        customerId={customerId}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  // 无效路由，默认显示创建表单
  return (
    <CustomerForm
      mode='create'
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
