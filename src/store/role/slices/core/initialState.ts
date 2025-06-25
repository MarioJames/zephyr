import { RoleItem } from '@/services/roles';

// ========== 核心功能状态接口 ==========
export interface CoreState {
  roles: RoleItem[];                    // 所有角色列表
  currentRole: RoleItem | null;         // 当前选中的角色详情
  roleMap: Record<string, RoleItem>;    // 角色ID映射，用于快速查找
  loading: boolean;                     // 加载状态
  error: string | null;                 // 错误信息
}

// ========== 核心功能初始状态 ==========
export const coreInitialState: CoreState = {
  roles: [],
  currentRole: null,
  roleMap: {},
  loading: false,
  error: null,
};
