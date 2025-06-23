import { http } from "../request";

// 角色相关类型定义
export interface RoleItem {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 获取系统中所有角色信息
 * @description 用户进入管理系统时获取，存储下来，在员工管理等页面使用
 * @param null
 * @returns RoleItem[]
 */
function getRoleList() {
  return http.get<RoleItem[]>("/api/v1/roles/list");
}

export default {
  getRoleList,
}; 