import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';
import { createDevtools } from '../middleware/createDevtools';
import userService, { UserItem, UserCreateRequest, UserUpdateRequest } from '@/services/user';
import rolesService, { RoleItem } from '@/services/roles';

// ========== State & Action 类型 ==========
export interface EmployeeState {
  employees: UserItem[];
  roles: RoleItem[];
  loading: boolean;
  error: string | null;
}

export interface EmployeeAction {
  fetchEmployees: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  addEmployee: (data: UserCreateRequest) => Promise<void>;
  updateEmployee: (id: string, data: UserUpdateRequest) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export type EmployeeStore = EmployeeState & EmployeeAction;

// ========== 初始状态 ==========
export const initialEmployeeState: EmployeeState = {
  employees: [],
  roles: [],
  loading: false,
  error: null,
};

// ========== Slice 工厂 ==========
export const createEmployeeSlice: StateCreator<EmployeeStore, [['zustand/devtools', never]], [], EmployeeStore> = (set, get) => ({
  ...initialEmployeeState,
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await userService.getAllUsers();
      set({ employees: res });
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

// ========== 实装 useStore ==========
const devtools = createDevtools('employee');

export const useEmployeeStore = createWithEqualityFn<EmployeeStore>()(
  subscribeWithSelector(devtools(createEmployeeSlice)),
  shallow,
);

export const getEmployeeStoreState = () => useEmployeeStore.getState(); 