'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useCustomerStore } from '@/store/customer';
import { useAgentStore } from '@/store/agent';
import { type CustomerFormData } from './CustomerForm';
import { type CustomerItem } from '@/services/customer';
import { type AgentItem } from '@/services/agents';
import {
  customerItemToFormData,
  formDataToCreateRequest,
  formDataToUpdateRequest,
} from './utils';

interface UseCustomerFormParams {
  params?: string[];
}

interface UseCustomerFormReturn {
  // 状态
  mode: 'create' | 'edit';
  customerId?: string;
  currentCustomer?: CustomerItem;
  initialData?: CustomerFormData;
  agents: AgentItem[];
  loading: boolean;
  error: string | null;

  // 方法
  handleSubmit: (data: CustomerFormData) => Promise<void>;
  handleCancel: () => void;
  clearError: () => void;
}

export function useCustomerForm({
  params,
}: UseCustomerFormParams): UseCustomerFormReturn {
  const router = useRouter();
  const routeParams = params;

  // 解析路由参数
  const actionType = routeParams?.[0] || 'create';
  const customerId = routeParams?.[1];
  const mode = actionType === 'edit' && customerId ? 'edit' : 'create';

  // Customer store
  const {
    currentCustomer,
    loading: customerLoading,
    error: customerError,
    fetchCustomerDetail,
    createCustomer,
    updateCustomer,
    clearError: clearCustomerError,
    setCurrentCustomer,
  } = useCustomerStore();

  // Agent store
  const {
    agents,
    isLoading: agentsLoading,
    error: agentsError,
    fetchAgents,
  } = useAgentStore();

  // 本地状态
  const [isInitialized, setIsInitialized] = useState(false);

  // 组合的加载和错误状态
  const loading = customerLoading || agentsLoading || !isInitialized;
  const error = customerError || agentsError || null;

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        // 清除之前的错误状态
        clearCustomerError();

        // 加载智能体列表
        if (agents.length === 0) {
          await fetchAgents();
        }

        // 根据模式加载数据
        if (mode === 'create') {
          // 创建模式，清除当前客户数据
          setCurrentCustomer(undefined);
        } else if (mode === 'edit' && customerId) {
          // 编辑模式，加载客户数据
          await fetchCustomerDetail(customerId);
        } else if (
          routeParams &&
          routeParams.length > 0 &&
          actionType !== 'create' &&
          actionType !== 'edit'
        ) {
          // 无效的路由格式，记录警告但不重定向（避免循环）
          console.warn('无效的路由格式，将使用创建模式:', routeParams);
        }

        setIsInitialized(true);
      } catch (err) {
        console.error('初始化数据失败:', err);
        setIsInitialized(true);
      }
    };

    initializeData();
  }, [
    mode,
    customerId,
    actionType,
    routeParams,
    clearCustomerError,
    setCurrentCustomer,
    fetchCustomerDetail,
    fetchAgents,
    agents.length,
    router,
  ]);

  // 处理表单提交
  const handleSubmit = useCallback(
    async (data: CustomerFormData) => {
      try {
        if (mode === 'edit' && customerId) {
          // 编辑模式
          const updateData = formDataToUpdateRequest(data);

          await updateCustomer(customerId, updateData);
          message.success('客户信息更新成功！');
        } else {
          // 新增模式
          const createData = formDataToCreateRequest(data);

          await createCustomer(createData);
          message.success('客户添加成功！');
        }

        // 成功后跳转到客户管理页面
        router.push('/customer');
      } catch (error) {
        // 错误已经在store中处理，这里只需要显示通用错误消息
        message.error(
          mode === 'edit' ? '更新客户失败，请重试' : '添加客户失败，请重试'
        );
        console.error('操作失败:', error);
        throw error;
      }
    },
    [mode, customerId, agents, updateCustomer, createCustomer, router]
  );

  // 处理取消操作
  const handleCancel = useCallback(() => {
    router.push('/customer');
  }, [router]);

  // 清除错误
  const clearError = useCallback(() => {
    clearCustomerError();
  }, [clearCustomerError]);

  // 准备初始数据
  const initialData =
    currentCustomer && mode === 'edit'
      ? customerItemToFormData(currentCustomer)
      : undefined;

  return {
    mode,
    customerId,
    currentCustomer,
    initialData,
    agents,
    loading,
    error,
    handleSubmit,
    handleCancel,
    clearError,
  };
}
