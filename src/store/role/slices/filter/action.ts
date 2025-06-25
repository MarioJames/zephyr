import { StateCreator } from 'zustand/vanilla';
import rolesService, { RoleItem } from '@/services/roles';
import { RoleState } from '../../initialState';
import { CoreAction } from '../core/action';
import { PermissionsAction } from '../permissions/action';

// ========== 过滤功能Action接口 ==========
export interface FilterAction {
  fetchActiveRoles: () => Promise<void>;
  setNameFilter: (name: string) => void;
  setPermissionFilters: (permissions: string[]) => void;
  addPermissionFilter: (permission: string) => void;
  removePermissionFilter: (permission: string) => void;
  setShowActiveOnly: (showActiveOnly: boolean) => void;
  applyFilters: () => void;
  clearFilters: () => void;
}

// ========== 过滤功能Action实现 ==========
export const filterSlice: StateCreator<
  RoleState & CoreAction & PermissionsAction & FilterAction,
  [],
  [],
  FilterAction
> = (set, get) => ({
  // 获取活跃角色
  fetchActiveRoles: async () => {
    const { activeRolesLoading } = get();
    if (activeRolesLoading) return;

    set({ activeRolesLoading: true, activeRolesError: null });

    try {
      const data = await rolesService.getActiveRoles();
      set({
        activeRoles: data,
        activeRolesLoading: false,
        activeRolesError: null,
      });

      // 如果当前开启了活跃角色过滤，重新应用过滤
      const { showActiveOnly } = get();
      if (showActiveOnly) {
        get().applyFilters();
      }
    } catch (error) {
      set({
        activeRolesLoading: false,
        activeRolesError: error instanceof Error ? error.message : '获取活跃角色失败',
      });
    }
  },

  // 设置名称过滤
  setNameFilter: (name: string) => {
    set({ nameFilter: name });
    get().applyFilters();
  },

  // 设置权限过滤
  setPermissionFilters: (permissions: string[]) => {
    set({ permissionFilters: permissions });
    get().applyFilters();
  },

  // 添加权限过滤条件
  addPermissionFilter: (permission: string) => {
    set((state) => ({
      permissionFilters: Array.from(new Set([...state.permissionFilters, permission])),
    }));
    get().applyFilters();
  },

  // 移除权限过滤条件
  removePermissionFilter: (permission: string) => {
    set((state) => ({
      permissionFilters: state.permissionFilters.filter(p => p !== permission),
    }));
    get().applyFilters();
  },

  // 设置是否只显示活跃角色
  setShowActiveOnly: (showActiveOnly: boolean) => {
    set({ showActiveOnly });
    get().applyFilters();
  },

  // 应用所有过滤条件
  applyFilters: () => {
    const {
      roles,
      activeRoles,
      nameFilter,
      permissionFilters,
      showActiveOnly,
      permissionsCache
    } = get();

    // 选择基础角色列表
    let baseRoles = showActiveOnly && activeRoles.length > 0 ? activeRoles : roles;

    // 应用过滤
    let filtered = baseRoles;

    // 名称过滤
    if (nameFilter) {
      const lowerFilter = nameFilter.toLowerCase();
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(lowerFilter) ||
        (role.description && role.description.toLowerCase().includes(lowerFilter))
      );
    }

    // 权限过滤
    if (permissionFilters.length > 0) {
      filtered = filtered.filter(role => {
        const rolePermissions = permissionsCache[role.id];
        if (!rolePermissions) return false;

        // 检查是否包含所有指定的权限
        return permissionFilters.every(permission =>
          rolePermissions.includes(permission)
        );
      });
    }

    set({ filteredRoles: filtered });
  },

  // 清除所有过滤条件
  clearFilters: () => {
    set({
      nameFilter: '',
      permissionFilters: [],
      showActiveOnly: false,
      filteredRoles: [],
    });
  },
});
