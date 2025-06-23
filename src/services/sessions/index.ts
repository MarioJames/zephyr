import { http } from "../request";
import { CreateAgentRequest } from "../agents";

// 会话相关类型定义
export interface SessionItem {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  type?: "agent" | "group";
  userId: string;
  groupId?: string;
  clientId?: string;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionListRequest {
  page?: number;
  pageSize?: number;
  groupId?: string;
  userId?: string; // 会话所属的员工 ID，没有则查询全部
}

export interface SessionCreateRequest {
  title: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  groupId?: string;
  agentId?: string;
}

export interface SessionUpdateRequest {
  title?: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  groupId?: string;
  agentId?: string;
}

export interface SessionSearchRequest {
  q: string;        // 搜索关键词
  limit?: number;   // 结果限制
}

export interface SessionCloneRequest {
  title?: string;
  includeMessages?: boolean;
}

/**
 * 获取会话列表
 * @description 获取会话列表，支持分页和筛选
 * @param params SessionListRequest
 * @returns SessionItem[]
 */
function getSessionList(params?: SessionListRequest) {
  return http.get<SessionItem[]>('/api/v1/sessions', params);
}

/**
 * 获取分组会话列表
 * @description 获取按组分类的会话列表
 * @param null
 * @returns SessionItem[]
 */
function getGroupedSessions() {
  return http.get<SessionItem[]>('/api/v1/sessions/grouped');
}

/**
 * 搜索会话
 * @description 根据关键词搜索会话
 * @param params SessionSearchRequest
 * @returns SessionItem[]
 */
function searchSessions(params: SessionSearchRequest) {
  return http.get<SessionItem[]>('/api/v1/sessions/search', params);
}

/**
 * 创建会话
 * @description 创建新的会话
 * @param data SessionCreateRequest
 * @returns SessionItem
 */
function createSession(data: SessionCreateRequest) {
  return http.post<SessionItem>('/api/v1/sessions', data);
}

/**
 * 获取会话详情
 * @description 根据ID获取会话详细信息
 * @param id string
 * @returns SessionItem
 */
function getSessionDetail(id: string) {
  return http.get<SessionItem>(`/api/v1/sessions/${id}`);
}

/**
 * 更新会话
 * @description 更新会话信息
 * @param id string
 * @param data SessionUpdateRequest
 * @returns SessionItem
 */
function updateSession(id: string, data: SessionUpdateRequest) {
  return http.put<SessionItem>(`/api/v1/sessions/${id}`, data);
}

/**
 * 删除会话
 * @description 删除指定的会话
 * @param id string
 * @returns void
 */
function deleteSession(id: string) {
  return http.delete<void>(`/api/v1/sessions/${id}`);
}

/**
 * 克隆会话
 * @description 克隆现有会话创建新会话
 * @param id string
 * @param data SessionCloneRequest
 * @returns SessionItem
 */
function cloneSession(id: string, data: SessionCloneRequest) {
  return http.post<SessionItem>(`/api/v1/sessions/${id}/clone`, data);
}

export default {
  getSessionList,
  getGroupedSessions,
  searchSessions,
  createSession,
  getSessionDetail,
  updateSession,
  deleteSession,
  cloneSession,
}; 