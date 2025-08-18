import { StateCreator } from 'zustand/vanilla';
import userService, {
  UserItem,
  UserCreateRequest,
  UserUpdateRequest,
  UserUpdateRoleRequest,
} from '@/services/user';
import filesService from '@/services/files';
import sessionsService, { SessionItem } from '@/services/sessions';
import { EmployeeState } from '../../initialState';
import { useSessionStore } from '@/store/session';
import { litellmAPI } from '@/services';

// 定义具有其他 slice 方法的扩展状态接口
interface ExtendedEmployeeState {
  fetchAllEmployeeStats?: () => Promise<void>;
  filterEmployees?: () => void;
}

// ========== 核心功能Action接口 ==========
export interface CoreAction {
  fetchEmployees: (options?: {
    page?: number;
    pageSize?: number;
    skipStats?: boolean;
  }) => Promise<void>;
  fetchEmployeesWithStats: () => Promise<void>;
  addEmployee: (data: UserCreateRequest) => Promise<UserItem>;
  updateEmployee: (
    employee: UserItem,
    data: UserUpdateRequest
  ) => Promise<void>;
  deleteEmployee: (employee: UserItem) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  fetchSessionList: () => Promise<
    Array<{
      id: string;
      customerName: string;
      employeeName: string;
      userId: string;
    }>
  >;
  updateEmployeeSessions: (
    userId: string,
    sessionIds: string[]
  ) => Promise<void>;
  updateEmployeeRole: (
    employee: UserItem,
    data: UserUpdateRoleRequest
  ) => Promise<void>;
}

// ========== 核心功能Slice ==========
export const coreSlice: StateCreator<
  EmployeeState & CoreAction,
  [],
  [],
  CoreAction
> = (set, get) => ({
  fetchEmployees: async (options = {}) => {
    const { skipStats = false, page = 1, pageSize = 10 } = options;
    set({ loading: true, error: null });
    try {
      const res = await userService.getAllUsers({ page, pageSize });
      set({ employees: res });

      // 获取其他slice的方法并调用
      const state = get() as EmployeeState & CoreAction & ExtendedEmployeeState;

      // 根据skipStats参数决定是否获取统计数据
      if (!skipStats && state.fetchAllEmployeeStats) {
        await state.fetchAllEmployeeStats();
      }

      if (state.filterEmployees) {
        state.filterEmployees();
      }
    } catch (e: unknown) {
      set({ error: (e as Error)?.message || '获取员工列表失败' });
    } finally {
      set({ loading: false });
    }
  },

  fetchEmployeesWithStats: async () => {
    // 带统计数据的员工获取方法
    await get().fetchEmployees({ skipStats: false });
  },

  addEmployee: async (data) => {
    set({ loading: true, error: null });
    try {
      const createdUser = await userService.createUser(data);
      // 使用传入的roleId，并转换为number类型
      if (data.roleId) {
        await userService.updateUserRole(createdUser.id, {
          addRoles: [{ roleId: Number(data.roleId) }],
        });

        await litellmAPI.addUserToTeam(createdUser.id, data.roleId);
      }

      await get().fetchEmployees();
      return createdUser;
    } catch (e: unknown) {
      set({ error: (e as Error)?.message || '添加员工失败' });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  updateEmployee: async (employee, data) => {
    set({ loading: true, error: null });
    try {
      await userService.updateUser(employee.id, {
        ...data,
        roleIds: [Number(data.roleId)],
      });

      // 如果员工角色发生变化，则也需要在 litellm 中删除旧角色，添加新角色
      if (employee.roles![0]?.id !== data?.roleId) {
        await litellmAPI.removeUserFromTeam(
          employee.id,
          employee.roles![0]!.id.toString()
        );

        await litellmAPI.addUserToTeam(employee.id, data.roleId!.toString());
      }
    } catch (e: unknown) {
      set({ error: (e as Error)?.message || '修改员工失败' });
    } finally {
      set({ loading: false });
    }
  },

  deleteEmployee: async (employee) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(employee.id);

      // 删除员工时，需要删除员工在 litellm 中的关联
      for (const role of employee.roles || []) {
        await litellmAPI.removeUserFromTeam(employee.id, role.id.toString());
      }

      await get().fetchEmployees();
    } catch (e: unknown) {
      set({ error: (e as Error)?.message || '删除员工失败' });
    } finally {
      set({ loading: false });
    }
  },

  updateEmployeeRole: async (employee, data) => {
    set({ loading: true, error: null });
    try {
      await userService.updateUserRole(employee.id, data);

      // 删除员工在 litellm 中的关联
      for (const role of data.removeRoles || []) {
        await litellmAPI.removeUserFromTeam(employee.id, role.toString());
      }

      // 建立新的角色关联信息
      for (const role of data.addRoles || []) {
        await litellmAPI.addUserToTeam(employee.id, role.roleId.toString());
      }
    } catch (e: unknown) {
      set({ error: (e as Error)?.message || '修改员工角色失败' });
    } finally {
      set({ loading: false });
    }
  },

  uploadAvatar: async (file) => {
    try {
      const res = await filesService.upload({
        file,
        directory: 'avatar',
      });
      return res.url;
    } catch (e: unknown) {
      throw new Error((e as Error)?.message || '头像上传失败');
    }
  },

  fetchSessionList: async () => {
    console.log('fetchSessionList employee slice core action');
    const res = await sessionsService.getSessionList({
      page: 1,
      pageSize: 100,
      targetUserId: 'ALL',
    });

    // 格式化为{id, customerName, employeeName, userId}
    return res.sessions.map((s: SessionItem) => ({
      id: s.id,
      customerName: s.title,
      employeeName: s.user?.fullName || s.user?.username || '',
      userId: s.userId || '',
    }));
  },

  updateEmployeeSessions: async (userId, sessionIds) => {
    // 使用新的batchTransferSessions API来完整转移sessions及其相关数据
    const result = await sessionsService.batchTransferSessions(
      sessionIds,
      userId
    );
    // 标记session数据需要刷新
    useSessionStore.getState().setNeedsRefresh(true);
    console.log(`批量转移完成: ${result.length} 个会话`);
    await get().fetchEmployees();
  },
});
