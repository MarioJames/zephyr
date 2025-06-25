import { UserItem } from '@/services/user';
import { RoleItem } from '@/services/roles';

// ========== 核心功能状态接口 ==========
export interface CoreState {
  employees: UserItem[];
  roles: RoleItem[];
  loading: boolean;
  error: string | null;
}

// ========== 核心功能初始状态 ==========
export const coreInitialState: CoreState = {
  employees: [],
  roles: [],
  loading: false,
  error: null,
};
