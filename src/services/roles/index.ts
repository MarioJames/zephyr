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
  [key: string]: unknown;
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

export default {
  getAllRoles,
};
