import { useState, useCallback } from 'react';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import customerAPI, { CustomerItem } from '@/services/customer';
import { AgentItem } from '@/services/agents';

export interface UseCustomerDetailReturn {
  // 状态
  customerDetail: CustomerItem | null;
  loading: boolean;
  error: string | null;
  deleting: boolean;
  updating: boolean;

  // 方法
  fetchCustomerDetail: (sessionId: string) => Promise<void>;
  deleteCustomer: (sessionId: string) => Promise<void>;
  assignEmployee: (sessionId: string, agent: AgentItem) => Promise<void>;
  clearError: () => void;
}

export const useCustomerDetail = (): UseCustomerDetailReturn => {
  const router = useRouter();

  // 本地状态管理
  const [customerDetail, setCustomerDetail] = useState<CustomerItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // 获取客户详情
  const fetchCustomerDetail = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      const detail = await customerAPI.getCustomerDetail(sessionId);
      setCustomerDetail(detail);
    } catch (error) {
      console.error('获取客户详情失败:', error);
      const errorMessage = error instanceof Error ? error.message : '获取客户详情失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除客户
  const deleteCustomer = useCallback(async (sessionId: string) => {
    try {
      setDeleting(true);
      setError(null);

      await customerAPI.deleteCustomer(sessionId);
      message.success('客户删除成功！');
      router.push('/customer');
    } catch (error) {
      console.error('删除客户失败:', error);
      const errorMessage = error instanceof Error ? error.message : '删除客户失败';
      setError(errorMessage);
      message.error('删除客户失败，请重试');
    } finally {
      setDeleting(false);
    }
  }, [router]);

  // 分配员工
  const assignEmployee = useCallback(async (sessionId: string, agent: AgentItem) => {
    if (!customerDetail) return;

    try {
      setUpdating(true);
      setError(null);

      // 暂时显示成功消息，等待接口实现
      message.success(
        `已将客户 ${customerDetail.session.title || '客户'} 分配给 ${agent.title}`
      );

      // TODO: 实现真实的员工分配逻辑
      // const updateData = {
      //   ...customerDetail.session,
      //   agent: agent
      // };
      // await customerAPI.updateCustomer(sessionId, updateData);
      // await fetchCustomerDetail(sessionId);
    } catch (error) {
      console.error('分配员工失败:', error);
      const errorMessage = error instanceof Error ? error.message : '分配员工失败';
      setError(errorMessage);
      message.error('分配员工失败，请重试');
    } finally {
      setUpdating(false);
    }
  }, [customerDetail]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    customerDetail,
    loading,
    error,
    deleting,
    updating,

    // 方法
    fetchCustomerDetail,
    deleteCustomer,
    assignEmployee,
    clearError,
  };
};
