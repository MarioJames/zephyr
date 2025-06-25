import { StateCreator } from 'zustand/vanilla';
import rolesService from '@/services/roles';
import { RoleState } from '../../initialState';

// ========== 权限管理Action接口 ==========
export interface PermissionsAction {
  fetchRolePermissions: (roleId: string) => Promise<void>;
  setRolePermissions: (roleId: string, permissions: string[]) => void;
  clearPermissionsCache: () => void;
  clearRolePermissions: (roleId: string) => void;
  hasRolePermission: (roleId: string, permission: string) => boolean;
}

// ========== 权限管理Action实现 ==========
export const permissionsSlice: StateCreator<
  RoleState,
  [],
  [],
  PermissionsAction
> = (set, get) => ({
  // 获取指定角色的权限
  fetchRolePermissions: async (roleId: string) => {
    const { permissionsCache, permissionsLoading } = get();

    // 如果缓存中已存在，直接返回
    if (permissionsCache[roleId]) {
      return;
    }

    // 如果正在加载，避免重复请求
    if (permissionsLoading[roleId]) {
      return;
    }

    // 设置加载状态
    set((state) => ({
      permissionsLoading: {
        ...state.permissionsLoading,
        [roleId]: true,
      },
      permissionsError: {
        ...state.permissionsError,
        [roleId]: null,
      },
    }));

    try {
      const permissions = await rolesService.getRolePermissions(roleId);

      set((state) => ({
        permissionsCache: {
          ...state.permissionsCache,
          [roleId]: permissions,
        },
        permissionsLoading: {
          ...state.permissionsLoading,
          [roleId]: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        permissionsLoading: {
          ...state.permissionsLoading,
          [roleId]: false,
        },
        permissionsError: {
          ...state.permissionsError,
          [roleId]: error instanceof Error ? error.message : '获取权限失败',
        },
      }));
    }
  },

  // 手动设置角色权限
  setRolePermissions: (roleId: string, permissions: string[]) => {
    set((state) => ({
      permissionsCache: {
        ...state.permissionsCache,
        [roleId]: permissions,
      },
      permissionsError: {
        ...state.permissionsError,
        [roleId]: null,
      },
    }));
  },

  // 清除所有权限缓存
  clearPermissionsCache: () => {
    set({
      permissionsCache: {},
      permissionsLoading: {},
      permissionsError: {},
    });
  },

  // 清除指定角色的权限缓存
  clearRolePermissions: (roleId: string) => {
    set((state) => {
      const { permissionsCache, permissionsLoading, permissionsError } = state;

      const newCache = { ...permissionsCache };
      const newLoading = { ...permissionsLoading };
      const newError = { ...permissionsError };

      delete newCache[roleId];
      delete newLoading[roleId];
      delete newError[roleId];

      return {
        permissionsCache: newCache,
        permissionsLoading: newLoading,
        permissionsError: newError,
      };
    });
  },

  // 检查角色是否拥有指定权限
  hasRolePermission: (roleId: string, permission: string): boolean => {
    const { permissionsCache } = get();
    const permissions = permissionsCache[roleId];
    return permissions ? permissions.includes(permission) : false;
  },
});
