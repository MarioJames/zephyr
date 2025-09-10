'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { App, FormInstance } from 'antd';
import { useCustomerStore } from '@/store/customer';
import { useAgentStore } from '@/store/agent';
import { type CustomerFormData } from './CustomerForm';
import customerAPI, { type CustomerItem } from '@/services/customer';
import { type AgentItem } from '@/services/agents';
import {
  customerItemToFormData,
  formDataToCreateRequest,
  formDataToUpdateRequest,
} from './utils';
import { topicsAPI } from '@/services';
import { useGlobalStore } from '@/store/global';
import { globalSelectors } from '@/store/global/selectors';
import { useChatStore } from '@/store/chat';

interface UseCustomerFormParams {
  form: FormInstance<CustomerFormData>;
  params?: string[];
}

interface UseCustomerFormReturn {
  // 状态
  mode: 'create' | 'edit';
  customerId?: string;
  currentCustomer?: CustomerItem;
  agents: AgentItem[];
  loading: boolean;
  error: string | null;

  // 方法
  handleSubmit: (data: CustomerFormData) => Promise<void>;
  handleCancel: () => void;
  clearError: () => void;
  submitLoading: boolean;
}

export function useCustomerForm({
  form,
  params,
}: UseCustomerFormParams): UseCustomerFormReturn {
  const { message, modal } = App.useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [submitLoading, setSubmitLoading] = useState(false);
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);

  const [loading, setLoading] = useState(false);

  // Customer store
  const {
    error: customerError,
    createCustomer,
    updateCustomer,
    clearError: clearCustomerError,
  } = useCustomerStore();

  // Agent store
  const { agents } = useAgentStore();

  const error = customerError || null;

  const { mode, customerId } = useMemo(() => {
    // 解析路由参数
    const actionType = params?.[0] || 'create';
    const customerId = params?.[1];
    const mode: 'create' | 'edit' =
      actionType === 'edit' && customerId ? 'edit' : 'create';

    return {
      mode,
      customerId,
    };
  }, [params]);

  // 初始化客户数据
  const handleInitCustomer = useCallback(
    async (sessionId: string) => {
      setLoading(true);

      try {
        const customer = await customerAPI.getCustomerDetail(sessionId);

        const formData = customerItemToFormData(customer);

        form.setFieldsValue(formData);
      } catch (error) {
        console.error('初始化客户数据失败:', error);
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  // 初始化数据
  useEffect(() => {
    if (mode === 'edit' && customerId) {
      handleInitCustomer(customerId);
    } else {
      form.resetFields();
      // 如果是创建模式，设置默认选中的agent
      const agentId = searchParams?.get('agentId');
      // 使用单次setFieldsValue设置所有字段值
      form.setFieldsValue({
        agentId: agentId || (agents.length > 0 ? agents[0].id : undefined),
      });
    }
  }, [handleInitCustomer, mode, customerId, form, searchParams, agents]);

  // 处理表单提交
  const handleSubmit = useCallback(
    async (data: CustomerFormData) => {
      try {
        setSubmitLoading(true);
        if (mode === 'edit' && customerId) {
          // 编辑模式
          const updateData = formDataToUpdateRequest(data);

          await updateCustomer(customerId, updateData);

          message.success('客户更新成功！');

          if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back();
          } else {
            if (isAdmin) {
              router.push('/customer');
            } else {
              modal.confirm({
                title: '提示',
                content: '客户更新成功，是否返回对话？',
                onOk: async () => {
                  try {
                    const topics = await topicsAPI.getTopicList(customerId);
                    const activeTopicId = topics?.[0]?.id;
                    router.push(`/chat?session=${customerId}${activeTopicId ? `&topic=${activeTopicId}` : ''}`);
                  } catch {
                    router.push(`/chat?session=${customerId}`);
                  }
                },
              });
            }
          }
        } else {
          // 新增模式
          const createData = formDataToCreateRequest(data);

          const newCustomer = await createCustomer(createData);

          // 创建话题
          const topic = await topicsAPI.createTopic({
            title: '默认话题',
            sessionId: newCustomer!.session.id,
          });

          modal.confirm({
            title: '提示',
            content: '客户添加成功，是否立即开始对话？',
            onOk: () => {
              useChatStore.getState().resetChatState();
              router.push(
                `/chat?session=${newCustomer!.session.id}&topic=${topic.id}`
              );
            },
            onCancel: () => {
              if (isAdmin) {
                router.push('/customer');
              }
            },
          });
        }
      } catch (error) {
        // 错误已经在store中处理，这里只需要显示通用错误消息
        message.error(
          mode === 'edit' ? '更新客户失败，请重试' : '添加客户失败，请重试'
        );
        console.error('操作失败:', error);
        throw error;
      } finally {
        setSubmitLoading(false);
      }
    },
    [
      mode,
      customerId,
      agents,
      updateCustomer,
      createCustomer,
      router,
      setSubmitLoading,
    ]
  );

  // 处理取消操作
  const handleCancel = useCallback(() => {
    if (isAdmin) {
      router.push('/customer');
    } else {
      router.push('/chat');
    }
  }, [router, isAdmin]);

  // 清除错误
  const clearError = useCallback(() => {
    clearCustomerError();
  }, [clearCustomerError]);

  return {
    mode,
    customerId,
    agents,
    loading,
    error,
    handleSubmit,
    handleCancel,
    clearError,
    submitLoading,
  };
}
