import { UserItem } from '@/services/user';

// ========== 核心功能状态接口 ==========
export interface CoreState {
  employees: UserItem[];
  loading: boolean;
  error: string | null;
}

// ========== 核心功能初始状态 ==========
export const coreInitialState: CoreState = {
  employees: [],
  loading: false,
  error: null,
};
