import { StateCreator } from 'zustand/vanilla';
import customerAPI, {
  type CustomerItem,
  type CustomerListRequest,
  type CustomerCreateRequest,
} from '@/services/customer';
import { CustomerState } from '../../initialState';

// ========== 核心功能Action接口 ==========
export interface CoreAction {
  fetchCustomers: (params?: CustomerListRequest) => Promise<void>;
  createCustomer: (data: CustomerCreateRequest) => Promise<void>;
  updateCustomer: (
    sessionId: string,
    data: CustomerCreateRequest
  ) => Promise<void>;
  deleteCustomer: (sessionId: string) => Promise<void>;
  clearError: () => void;
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
      });
    } catch (error) {
      console.error('获取客户列表失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '获取客户列表失败',
      });
    }
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

      // 刷新相关数据
      const state = get() as any;
      if (state.updateCategoryStats) {
        state.updateCategoryStats();
      }
      if (state.updateCustomerStats) {
        state.updateCustomerStats();
      }
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
        customers: state.customers.map((customer) =>
          customer.session.id === sessionId
            ? { ...customer, ...updatedCustomer }
            : customer
        ),
        loading: false,
      }));
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
    } catch (error) {
      console.error('删除客户失败:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : '删除客户失败',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
});
