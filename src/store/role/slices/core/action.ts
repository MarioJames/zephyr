import { StateCreator } from 'zustand/vanilla';
import rolesService, { RoleItem } from '@/services/roles';
import { RoleState } from '../../initialState';

// ========== 核心功能Action接口 ==========
export interface CoreAction {
  fetchAllRoles: () => Promise<void>;
  setCurrentRole: (role: RoleItem | null) => void;
  initRoles: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// ========== 核心功能Action实现 ==========
export const coreSlice: StateCreator<
  RoleState & CoreAction,
  [],
  [],
  CoreAction
> = (set, get) => ({
  initRoles: async () => {
    const state = get();

    try {
      await state.fetchAllRoles();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取角色列表失败',
      });
    } finally {
      set({ rolesInit: true });
    }
  },

  // 获取所有角色
  fetchAllRoles: async () => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true, error: null });

    try {
      const data = await rolesService.getAllRoles();

      // 构建角色映射表
      const roleMap: Record<string, RoleItem> = {};
      data.forEach((role) => {
        roleMap[role.id] = role;
      });

      set({
        roles: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '获取角色列表失败',
      });
    }
  },

  // 设置当前角色
  setCurrentRole: (role: RoleItem | null) => {
    set({ currentRole: role });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // 设置错误信息
  setError: (error: string | null) => {
    set({ error });
  },
});
