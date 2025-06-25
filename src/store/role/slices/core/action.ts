import { StateCreator } from 'zustand/vanilla';
import rolesService, { RoleItem } from '@/services/roles';
import { RoleState } from '../../initialState';

// ========== 核心功能Action接口 ==========
export interface CoreAction {
  fetchAllRoles: () => Promise<void>;
  fetchRoleById: (id: string) => Promise<void>;
  setCurrentRole: (role: RoleItem | null) => void;
  updateRoleInCache: (role: RoleItem) => void;
  clearRoleCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// ========== 核心功能Action实现 ==========
export const coreSlice: StateCreator<
  RoleState,
  [],
  [],
  CoreAction
> = (set, get) => ({
  // 获取所有角色
  fetchAllRoles: async () => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true, error: null });

    try {
      const data = await rolesService.getAllRoles();

      // 构建角色映射表
      const roleMap: Record<string, RoleItem> = {};
      data.forEach(role => {
        roleMap[role.id] = role;
      });

      set({
        roles: data,
        roleMap,
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

  // 根据ID获取角色详情
  fetchRoleById: async (id: string) => {
    const { roleMap } = get();

    // 如果缓存中已存在，直接使用
    if (roleMap[id]) {
      set({ currentRole: roleMap[id] });
      return;
    }

    set({ loading: true, error: null });

    try {
      const data = await rolesService.getRoleById(id);

      set((state) => ({
        currentRole: data,
        roleMap: {
          ...state.roleMap,
          [id]: data,
        },
        loading: false,
        error: null,
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '获取角色详情失败',
      });
    }
  },

  // 设置当前角色
  setCurrentRole: (role: RoleItem | null) => {
    set({ currentRole: role });
  },

  // 更新缓存中的角色
  updateRoleInCache: (role: RoleItem) => {
    set((state) => ({
      roleMap: {
        ...state.roleMap,
        [role.id]: role,
      },
      roles: state.roles.map(r => r.id === role.id ? role : r),
      currentRole: state.currentRole?.id === role.id ? role : state.currentRole,
    }));
  },

  // 清除角色缓存
  clearRoleCache: () => {
    set({
      roles: [],
      roleMap: {},
      currentRole: null,
    });
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
