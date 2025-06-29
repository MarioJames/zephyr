import { http } from '../request';

// 角色相关类型定义
export interface RoleItem {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isSystem?: boolean;
}

/**
 * 获取所有角色
 * @description 获取系统中所有角色信息
 * @param null
 * @returns RoleItem[]
 */
function getAllRoles() {
  return http.get<RoleItem[]>('/api/v1/roles');
}

/**
 * 获取活跃角色
 * @description 获取系统中所有活跃的角色
 * @param null
 * @returns RoleItem[]
 */
function getActiveRoles() {
  return http.get<RoleItem[]>('/api/v1/roles/active');
}

/**
 * 更新角色信息
 * @description 更新指定用户的角色
 * @param userId string
 * @param roleIds string[]
 * @returns void
 */
function updateRole(roleId: string, role: RoleItem) {
  return http.put<void>(`/api/v1/roles/${roleId}`, role);
}

/**
 * 根据ID获取角色
 * @description 获取指定ID的角色详情
 * @param id string
 * @returns RoleItem
 */
function getRoleById(id: string) {
  return http.get<RoleItem>(`/api/v1/roles/${id}`);
}

/**
 * 获取角色权限
 * @description 获取指定角色的权限列表
 * @param id string
 * @returns string[]
 */
function getRolePermissions(id: string) {
  return http.get<string[]>(`/api/v1/roles/${id}/permissions`);
}

export default {
  getAllRoles,
  getActiveRoles,
  getRoleById,
  getRolePermissions,
  updateRole,
};
