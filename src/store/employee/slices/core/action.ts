import { StateCreator } from 'zustand/vanilla';
import userService, { UserItem, UserCreateRequest, UserUpdateRequest } from '@/services/user';
import rolesService from '@/services/roles';
import { EmployeeState } from '../../initialState';

// ========== 核心功能Action接口 ==========
export interface CoreAction {
  fetchEmployees: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  addEmployee: (data: UserCreateRequest) => Promise<void>;
  updateEmployee: (id: string, data: UserUpdateRequest) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

// ========== 核心功能Slice ==========
export const coreSlice: StateCreator<
  EmployeeState & CoreAction,
  [],
  [],
  CoreAction
> = (set, get) => ({
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await userService.getAllUsers();
      set({ employees: res });

      // 获取其他slice的方法并调用
      const state = get() as any;
      if (state.fetchAllEmployeeStats) {
        await state.fetchAllEmployeeStats();
      }
      if (state.filterEmployees) {
        state.filterEmployees();
      }
    } catch (e: any) {
      set({ error: e?.message || '获取员工列表失败' });
    } finally {
      set({ loading: false });
    }
  },

  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await rolesService.getAllRoles();
      set({ roles: res });

      // 获取搜索slice的方法并调用
      const state = get() as any;
      if (state.buildRoleMap) {
        state.buildRoleMap();
      }
    } catch (e: any) {
      set({ error: e?.message || '获取角色列表失败' });
    } finally {
      set({ loading: false });
    }
  },

  addEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      await userService.createUser(data);
      await get().fetchEmployees();
    } catch (e: any) {
      set({ error: e?.message || '添加员工失败' });
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await userService.updateUser(id, data);
      await get().fetchEmployees();
    } catch (e: any) {
      set({ error: e?.message || '修改员工失败' });
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployee: async (id) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      await get().fetchEmployees();
    } catch (e: any) {
      set({ error: e?.message || '删除员工失败' });
    } finally {
      set({ loading: false });
    }
  },
});
