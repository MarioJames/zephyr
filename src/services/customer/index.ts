import { http } from '../request';

// 客户相关类型定义
export interface CustomerItem {
  // Session 基础信息
  session: {
    id: string;
    type: 'agent' | 'group';
    userId?: string;
    groupId?: string;
    agentId?: string;
    title: string;
    description?: string;
    avatar?: string;
    avatarBackground?: string;
    tags?: string[];
    inbox?: boolean;
    pinned?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  // 客户扩展信息
  extend?: {
    id: number;
    sessionId: string;
    gender?: string | null;
    age?: number | null;
    position?: string | null;
    phone?: string | null;
    email?: string | null;
    wechat?: string | null;
    company?: string | null;
    industry?: string | null;
    scale?: string | null;
    province?: string | null;
    city?: string | null;
    district?: string | null;
    address?: string | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface CustomerListRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
  assignee?: string;
}

export interface CustomerListResponse {
  data: CustomerItem[];
  total: number;
}

export interface CustomerCreateRequest {
  // 外部系统字段（sessions）
  title: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  groupId?: string;
  agentId?: string;

  // 内部扩展字段（customerSessions）
  gender?: string;
  age?: number;
  position?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  company?: string;
  industry?: string;
  scale?: string;
  province?: string;
  city?: string;
  district?: string;
  address?: string;
  notes?: string;
}

export interface CustomerUpdateRequest extends Partial<CustomerCreateRequest> {}

/**
 * 获取客户列表
 * @description 获取客户列表，支持分页、搜索等功能
 * @param params CustomerListRequest
 * @returns CustomerListResponse
 */
function getCustomerList(params?: CustomerListRequest) {
  return http.get<CustomerListResponse>('/api/customer', params);
}

/**
 * 获取客户详情
 * @description 通过 sessionId 获取客户详情
 * @param sessionId string
 * @returns CustomerItem
 */
function getCustomerDetail(sessionId: string) {
  return http.get<CustomerItem>('/api/customer', { sessionId });
}

/**
 * 创建客户
 * @description 创建新客户
 * @param data CustomerCreateRequest
 * @returns CustomerItem
 */
function createCustomer(data: CustomerCreateRequest) {
  return http.post<CustomerItem>('/api/customer', data);
}

/**
 * 更新客户
 * @description 更新客户信息
 * @param sessionId string
 * @param data CustomerUpdateRequest
 * @returns void
 */
function updateCustomer(sessionId: string, data: CustomerUpdateRequest) {
  return http.put<void>(`/api/customer?sessionId=${sessionId}`, data);
}

/**
 * 删除客户
 * @description 删除客户（实际可能是软删除）
 * @param sessionId string
 * @returns void
 */
function deleteCustomer(sessionId: string) {
  return http.delete<void>(`/api/customer?sessionId=${sessionId}`);
}

export default {
  getCustomerList,
  getCustomerDetail,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
