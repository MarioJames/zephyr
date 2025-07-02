import { CustomerItem, CustomerListRequest } from '@/services/customer';
import { CustomerSessionItem } from '@/database/schemas';
import { CustomerExtend } from '@/types/customer';

// ========== 核心功能状态接口 ==========
export interface CoreState {
  customers: CustomerItem[];
  currentCustomerExtend: CustomerExtend | null;
  total: number;
  loading: boolean;
  error: string | null;
  latestSearchParams: CustomerListRequest;
}

// ========== 核心功能初始状态 ==========
export const coreInitialState: CoreState = {
  customers: [],
  currentCustomerExtend: null,
  total: 0,
  loading: false,
  error: null,
  latestSearchParams: {
    page: 1,
    pageSize: 10,
  },
};
