import { http } from '../request';
import { AgentItem } from '../agents';
import { UserItem } from '../user';

// 会话相关类型定义
export interface SessionItem {
  id: string;
  slug: string;
  title?: string;
  description?: string;
  avatar?: string;
  backgroundColor?: string;
  type?: 'agent' | 'group';
  userId: string;
  groupId?: string;
  clientId?: string;
  pinned?: boolean;
  // 关联的员工完整信息
  user?: UserItem;
  // 关联的智能体
  agentsToSessions?: {
    agent: AgentItem;
  }[];
  messageCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SessionListRequest {
  page?: number;
  pageSize?: number;
  userId?: string;
  agentId?: string;
}

export interface SessionListResponse {
  sessions: SessionItem[];
  total: number;
}

export interface SessionSearchRequest {
  keyword: string;
  page?: number;
  pageSize?: number;
}

export interface BatchSessionListRequest {
  sessionIds: string[];
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
  userId?: string;
  pinned?: boolean;
}

export interface BatchSessionUpdateRequest {
  sessions: SessionUpdateRequest[];
}

export interface SessionStatGroupedByAgentItem {
  agent?: Partial<AgentItem>;
  count: number;
}

/**
 * 获取会话列表
 * @description 获取会话列表，支持分页和筛选
 * @param params SessionListRequest
 * @returns SessionListResponse
 */
function getSessionList(
  params?: SessionListRequest
): Promise<SessionListResponse> {
  return http.get<SessionListResponse>('/api/v1/sessions', params);
}

/**
 * 搜索会话列表
 * @description 搜索会话列表
 * @param params SessionSearchRequest
 * @returns SessionItem[]
 */
function searchSessionList(params: SessionSearchRequest) {
  return http.get<SessionItem[]>('/api/v1/sessions/search', params);
}

/**
 * 批量获取指定会话列表
 * @description 批量获取指定会话列表
 * @param params BatchSessionListRequest
 * @returns SessionItem[]
 */
function getSessionListByIds(
  params: BatchSessionListRequest
): Promise<SessionItem[]> {
  return http.get<SessionItem[]>(`/api/v1/sessions/batch`, params);
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
 * 创建会话
 * @description 创建新的会话
 * @param data SessionCreateRequest
 * @returns SessionItem
 */
function createSession(data: SessionCreateRequest) {
  return http.post<SessionItem>('/api/v1/sessions', data);
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
 * 获取按Agent分组的会话列表
 * GET /api/v1/sessions/grouped-by-agent
 * @param c Hono Context
 * @returns 按Agent分组的会话列表响应
 */
function getSessionsGroupedByAgent() {
  return http.get<SessionStatGroupedByAgentItem[]>(
    '/api/v1/sessions/grouped-by-agent'
  );
}

/**
 * 批量更新会话
 * PUT /api/v1/sessions/batch-update
 * @param c Hono Context
 * @returns 批量更新结果响应
 */
function batchUpdateSessions(data: SessionUpdateRequest[]) {
  return http.put<SessionItem[]>('/api/v1/sessions/batch-update', { sessions: data });
}

/**
 * 删除会话
 * @description 删除会话
 * @param id string
 * @returns void
 */
function deleteSession(id: string) {
  return http.delete<SessionItem>(`/api/v1/sessions/${id}`);
}

export default {
  getSessionList,
  searchSessionList,
  getSessionListByIds,
  getSessionDetail,
  createSession,
  updateSession,
  getSessionsGroupedByAgent,
  batchUpdateSessions,
  deleteSession,
};
