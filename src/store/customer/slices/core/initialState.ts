import { CustomerItem } from '@/services/customer';

// ========== 核心功能状态接口 ==========
export interface CoreState {
  customers: CustomerItem[];
  total: number;
  currentCustomer?: CustomerItem;
  loading: boolean;
  error: string | null;
}

// ========== 核心功能初始状态 ==========
export const coreInitialState: CoreState = {
  customers: [],
  total: 0,
  currentCustomer: undefined,
  loading: false,
  error: null,
};
