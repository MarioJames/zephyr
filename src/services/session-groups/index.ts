import { http } from '../request';

// 会话组相关类型定义
export interface SessionGroupItem {
  id: string;
  name: string;
  description?: string;
  sort?: number;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionGroupCreateRequest {
  name: string;
  description?: string;
  sort?: number;
}

export interface SessionGroupUpdateRequest {
  name?: string;
  description?: string;
  sort?: number;
}

export interface SessionGroupOrderRequest {
  orders: Array<{
    id: string;
    sort: number;
  }>;
}

/**
 * 获取会话组列表
 * @description 获取当前用户的所有会话组
 * @param null
 * @returns SessionGroupItem[]
 */
function getSessionGroupList() {
  return http.get<SessionGroupItem[]>('/api/v1/session-groups');
}

/**
 * 创建会话组
 * @description 创建新的会话组
 * @param data SessionGroupCreateRequest
 * @returns SessionGroupItem
 */
function createSessionGroup(data: SessionGroupCreateRequest) {
  return http.post<SessionGroupItem>('/api/v1/session-groups', data);
}

/**
 * 更新会话组排序
 * @description 批量更新会话组的排序
 * @param data SessionGroupOrderRequest
 * @returns void
 */
function updateSessionGroupOrder(data: SessionGroupOrderRequest) {
  return http.put<void>('/api/v1/session-groups/order', data);
}

/**
 * 获取会话组详情
 * @description 根据ID获取会话组详细信息
 * @param id string
 * @returns SessionGroupItem
 */
function getSessionGroupDetail(id: string) {
  return http.get<SessionGroupItem>(`/api/v1/session-groups/${id}`);
}

/**
 * 更新会话组
 * @description 更新会话组信息
 * @param id string
 * @param data SessionGroupUpdateRequest
 * @returns SessionGroupItem
 */
function updateSessionGroup(id: string, data: SessionGroupUpdateRequest) {
  return http.put<SessionGroupItem>(`/api/v1/session-groups/${id}`, data);
}

/**
 * 删除会话组
 * @description 删除指定的会话组
 * @param id string
 * @returns void
 */
function deleteSessionGroup(id: string) {
  return http.delete<void>(`/api/v1/session-groups/${id}`);
}

/**
 * 删除所有会话组
 * @description 删除当前用户的所有会话组
 * @param null
 * @returns void
 */
function deleteAllSessionGroups() {
  return http.delete<void>('/api/v1/session-groups');
}

export default {
  getSessionGroupList,
  createSessionGroup,
  updateSessionGroupOrder,
  getSessionGroupDetail,
  updateSessionGroup,
  deleteSessionGroup,
  deleteAllSessionGroups,
};