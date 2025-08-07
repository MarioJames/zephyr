import { StateCreator } from 'zustand/vanilla';
import customerAPI, {
  type CustomerItem,
  type CustomerListRequest,
  type CustomerCreateRequest,
} from '@/services/customer';
import { CustomerState } from '../../initialState';
import { useSessionStore } from '@/store/session';
import { CustomerExtend } from '@/types/customer';

// ========== 核心功能Action接口 ==========
export interface CoreAction {
  fetchCustomers: (params?: CustomerListRequest) => Promise<void>;

  refreshCustomers: () => Promise<void>;

  createCustomer: (
    data: CustomerCreateRequest
  ) => Promise<CustomerItem | undefined>;

  updateCustomer: (
    sessionId: string,
    data: CustomerCreateRequest
  ) => Promise<void>;

  deleteCustomer: (sessionId: string) => Promise<void>;

  clearError: () => void;

  // 获取客户的拓展配置
  getCustomerExtend: (sessionId: string) => Promise<void>;

  // 在对话页面修改客户拓展配置
  updateCustomerExtend: (data: Partial<CustomerExtend>) => Promise<void>;
}

// ========== 核心功能Slice ==========
export const coreSlice: StateCreator<
  CustomerState & CoreAction,
  [],
  [],
  CoreAction
> = (set, get) => ({
  fetchCustomers: async (params) => {
    try {
      set({ loading: true, error: null });

      // 获取客户列表
      const response = await customerAPI.getCustomerList(params);

      set({
        customers: response.data,
        total: response.total,
        loading: false,
        latestSearchParams: params,
      });
    } catch (error) {
      console.error('获取客户列表失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '获取客户列表失败',
      });
    }
  },

  refreshCustomers: async () => {
    const state = get();
    await state.fetchCustomers(state.latestSearchParams);
  },

  createCustomer: async (data) => {
    set({ loading: true, error: null });
    try {
      const newCustomer = await customerAPI.createCustomer(data);

      set((state) => ({
        customers: [newCustomer, ...state.customers],
        total: state.total + 1,
        loading: false,
      }));

      // 标记session数据需要刷新
      useSessionStore.getState().setNeedsRefresh(true);

      return newCustomer;
    } catch (error) {
      console.error('创建客户失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '创建客户失败',
      });
    }
  },

  updateCustomer: async (sessionId, data) => {
    set({ loading: true, error: null });
    try {
      const updatedCustomer = await customerAPI.updateCustomer(sessionId, data);

      // 更新本地状态
      set((state) => ({
        customers: state?.customers?.map((customer) =>
          customer?.session?.id === sessionId
            ? { ...customer, ...updatedCustomer }
            : customer
        ),
        loading: false,
      }));

      // 标记session数据需要刷新
      useSessionStore.getState().setNeedsRefresh(true);
    } catch (error) {
      console.error('更新客户失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '更新客户失败',
      });
    }
  },

  deleteCustomer: async (sessionId) => {
    set({ loading: true, error: null });
    try {
      await customerAPI.deleteCustomer(sessionId);

      // 更新本地状态
      set((state) => ({
        customers: state.customers.filter(
          (customer) => customer.session.id !== sessionId
        ),
        total: state.total - 1,
        loading: false,
      }));

      // 标记session数据需要刷新
      useSessionStore.getState().setNeedsRefresh(true);
    } catch (error) {
      console.error('删除客户失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '删除客户失败',
      });
    }
  },

  getCustomerExtend: async (sessionId) => {
    try {
      const extend = await customerAPI.getCustomerExtend(sessionId);

      set({
        currentCustomerExtend: extend,
      });
    } catch (error) {
      console.error('获取客户拓展配置失败:', error);
      throw error;
    }
  },

  // 更新用户的
  updateCustomerExtend: async (data) => {
    set({ loading: true, error: null });
    try {
      const updatedCustomer = await customerAPI.updateCustomerExtend(
        useSessionStore.getState().activeSessionId || '',
        data
      );

      // 更新当前客户
      set({
        currentCustomerExtend: updatedCustomer,
      });
    } catch (error) {
      console.error('更新客户聊天配置失败:', error);
      set({
        error: error instanceof Error ? error.message : '更新客户聊天配置失败',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
});
