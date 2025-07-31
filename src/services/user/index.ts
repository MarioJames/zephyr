import { http } from '../request';
import { RoleItem } from '../roles';
import { SessionItem } from '../sessions';


// 用户相关类型定义
export interface UserItem {
  id: string;
  username?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isOnboarded?: boolean;
  clerkCreatedAt?: string;
  emailVerifiedAt?: string;
  preference?: any;
  createdAt?: string;
  updatedAt?: string;
  roles?: RoleItem[];
  sessions?: SessionItem[];
}

export interface UserCreateRequest {
  id?: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
  roleId?: string;
}

export interface VirtualKeyResponse {
  keyVaults: {
    api_key: string;
  };
  roleId: string;
  userId: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  fullName?: string;
  avatar?: string;
  roleId?: string;
}

export interface UserSearchRequest {
  keyword: string;
  page?: number;
  pageSize?: number;
}

export interface UserListRequest {
  page?: number;
  pageSize?: number;
}

export interface UserUpdateRoleRequest {
  addRoles?: {
    expiresAt?: string;
    roleId: number;
  }[];
  removeRoleIds?: number[];
}

/**
 * 获取当前用户信息
 * @description 获取当前登录用户的详细信息
 * @param null
 * @returns UserItem
 */
function getCurrentUser() {
  return http.get<UserItem>('/api/v1/users/me');
}

/**
 * 获取所有用户
 * @description 获取系统中所有用户列表
 * @param null
 * @returns UserItem[]
 */
function getAllUsers(params?: UserListRequest) {
  return http.get<UserItem[]>('/api/v1/users', params);
}

/**
 * 根据关键字搜索用户
 * @description 根据关键字搜索用户
 * @param keyword string
 * @param pageSize number
 * @returns UserItem[]
 */
function searchUsers(keyword: string, pageSize?: number) {
  return http.get<UserItem[]>(
    `/api/v1/users/search?keyword=${keyword}&pageSize=${pageSize}`
  );
}

/**
 * 创建用户
 * @description 创建新的用户
 * @param data UserCreateRequest
 * @returns UserItem
 */
function createUser(data: UserCreateRequest) {
  return http.post<UserItem>('/api/v1/users', data);
}

/**
 * 获取用户详情
 * @description 根据ID获取用户详细信息
 * @param id string
 * @returns UserItem
 */
function getUserDetail(id: string) {
  return http.get<UserItem>(`/api/v1/users/${id}`);
}

/**
 * 更新用户
 * @description 更新用户信息
 * @param id string
 * @param data UserUpdateRequest
 * @returns UserItem
 */
function updateUser(id: string, data: UserUpdateRequest) {
  return http.put<UserItem>(`/api/v1/users/${id}`, data);
}

/**
 * 删除用户
 * @description 删除指定的用户
 * @param id string
 * @returns void
 */
function deleteUser(id: string) {
  return http.delete<void>(`/api/v1/users/${id}`);
}

/**
 * 更新用户角色
 */
function updateUserRole(id: string, data: UserUpdateRoleRequest) {
  return http.put<void>(`/api/v1/users/${id}/roles`, data);
}

/**
 * 获取虚拟KEY
 * @param userId 用户ID
 * @param roleId 角色ID
 * @returns { key: string }
 */
function getVirtualKey(userId: string, roleId: string) {
  return http.get<VirtualKeyResponse>(`/api/virtual-key?userId=${userId}&roleId=${roleId}`);
}

export default {
  getCurrentUser,
  getAllUsers,
  createUser,
  getUserDetail,
  updateUser,
  deleteUser,
  searchUsers,
  updateUserRole,
  getVirtualKey,
};
