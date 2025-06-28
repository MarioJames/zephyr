import { StateCreator } from 'zustand/vanilla';
import { EmployeeState } from '../../initialState';
import customerAPI from '@/services/customer';
import userService from '@/services/user';

// ========== 搜索功能Action接口 ==========
export interface SearchAction {
  setSearchQuery: (query: string) => void;
  filterEmployees: () => void;
  buildRoleMap: () => void;
  getRoleName: (roleId: string) => string;
  clearSearch: () => void;
  searchEmployees: (keyword: string, pageSize?: number) => Promise<void>;
}

// ========== 搜索功能Slice ==========
export const searchSlice: StateCreator<
  EmployeeState & SearchAction,
  [],
  [],
  SearchAction
> = (set, get) => ({
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterEmployees();
  },

  filterEmployees: () => {
    const { employees, searchQuery } = get();

    if (!searchQuery.trim()) {
      set({ filteredEmployees: employees });
      return;
    }

    const filtered = employees.filter(employee => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        employee.fullName?.toLowerCase().includes(searchTerm) ||
        employee.username?.toLowerCase().includes(searchTerm) ||
        employee.email?.toLowerCase().includes(searchTerm) ||
        employee.phone?.toLowerCase().includes(searchTerm) ||
        employee.id.toLowerCase().includes(searchTerm)
      );
    });

    set({ filteredEmployees: filtered });
  },

  buildRoleMap: () => {
    const { roles } = get();
    const roleMap: Record<string, string> = {};

    roles.forEach(role => {
      roleMap[role.id] = role.name;
    });

    set({ roleMap });
  },

  getRoleName: (roleId) => {
    const { roleMap } = get();
    return roleMap[roleId] || '未知角色';
  },

  clearSearch: () => {
    set({ searchQuery: '', filteredEmployees: [] });
  },

  searchEmployees: async (keyword: string, pageSize: number = 10) => {
    set({ loading: true, searchQuery: keyword });
    try {
      if (!keyword.trim()) {
        set({ filteredEmployees: get().employees, loading: false });
        return;
      }
      // 远程搜索用户
      const res = await userService.searchUsers({ keyword, page: 1, pageSize });
      set({ filteredEmployees: res, loading: false });
    } catch (e: any) {
      set({ filteredEmployees: [], loading: false });
    }
  },
});
