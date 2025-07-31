import { useState, useCallback } from 'react';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import customerAPI, { CustomerItem } from '@/services/customer';

export interface UseCustomerDetailReturn {
  // 状态
  sessionId: string;
  customerDetail: CustomerItem | null;
  loading: boolean;
  error: string | null;
  deleting: boolean;

  // 方法
  fetchCustomerDetail: () => Promise<void>;
  deleteCustomer: (sessionId: string) => Promise<void>;
  clearError: () => void;
}

export const useCustomerDetail = (
  sessionId: string
): UseCustomerDetailReturn => {
  const router = useRouter();

  // 本地状态管理
  const [customerDetail, setCustomerDetail] = useState<CustomerItem | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 获取客户详情
  const fetchCustomerDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const detail = await customerAPI.getCustomerDetail(sessionId);
      setCustomerDetail(detail);
    } catch (error) {
      console.error('获取客户详情失败:', error);
      const errorMessage =
        error instanceof Error ? error.message : '获取客户详情失败';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // 删除客户
  const deleteCustomer = useCallback(async () => {
    try {
      setDeleting(true);
      setError(null);

      await customerAPI.deleteCustomer(sessionId);
      message.success('客户删除成功！');
      router.push('/customer');
    } catch (error) {
      console.error('删除客户失败:', error);
      const errorMessage =
        error instanceof Error ? error.message : '删除客户失败';
      setError(errorMessage);
      message.error('删除客户失败，请重试');
    } finally {
      setDeleting(false);
    }
  }, [router]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    sessionId,
    customerDetail,
    loading,
    error,
    deleting,

    // 方法
    fetchCustomerDetail,
    deleteCustomer,
    clearError,
  };
};
