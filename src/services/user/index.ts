import { http } from "../request";

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
}

/**
 * 获取当前登录人信息
 * @description 用户进入管理系统时获取基本信息，在右下角进行展示登录人信息
 * @param null
 * @returns UserItem
 */
function getUserInfo() {
  return http.get<UserItem>("/api/v1/users/me");
}

/**
 * 获取系统中所有用户列表
 * @description 管理员角色用户进入后台页面时获取，用于在聊天页面基于员工维度对客户进行筛选
 * @param null
 * @returns UserItem[]
 */
function getUserList() {
  return http.get<UserItem[]>("/api/v1/users/list");
}

export default {
  getUserInfo,
  getUserList,
};
