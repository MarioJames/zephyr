import { CustomerItem, CustomerListRequest } from '@/services/customer';

// ========== 核心功能状态接口 ==========
export interface CoreState {
  customers: CustomerItem[];
  total: number;
  loading: boolean;
  error: string | null;
  latestSearchParams: CustomerListRequest;
}

// ========== 核心功能初始状态 ==========
export const coreInitialState: CoreState = {
  customers: [],
  total: 0,
  loading: false,
  error: null,
  latestSearchParams: {
    page: 1,
    pageSize: 10,
  },
};
