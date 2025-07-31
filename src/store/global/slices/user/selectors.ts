import { ADMIN_ROLES } from '@/const/role';
import { UserState } from './initialState';

/**
 * 用户相关的选择器
 */
export const userSelectors = {
  // 基础状态选择器
  currentUser: (s: UserState) => s.currentUser,
  userInit: (s: UserState) => s.userInit,
  virtualKey: (s: UserState) => s.virtualKey,
  userError: (s: UserState) => s.userError,

  // 用户信息提取
  userId: (s: UserState) => s.currentUser?.id || null,
  userName: (s: UserState) =>
    s.currentUser?.username || s.currentUser?.email || null,
  userEmail: (s: UserState) => s.currentUser?.email || null,
  userRoles: (s: UserState) => s.currentUser?.roles || [],
  currentRole: (s: UserState) => s.currentUser?.roles?.[0] || null,
  userAvatar: (s: UserState) => s.currentUser?.avatar || null,

  // 复合选择器
  isAdmin: (s: UserState) =>
    s.currentUser?.roles?.some((role) => role.name === 'admin') || false,

  // 判断当前账号是否为管理员账号
  isCurrentUserAdmin: (s: UserState) => {
    const roles = s.currentUser?.roles || [];
    return (
      Array.isArray(roles) && roles.some((r) => ADMIN_ROLES.includes(r?.name))
    );
  },
};
