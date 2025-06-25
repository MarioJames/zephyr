import { http } from '../request';
import { UserItem } from '../user';

// 话题相关类型定义
export interface TopicItem {
  id: string;
  title?: string;
  favorite?: boolean;
  sessionId?: string;
  messageCount: number;
  user: UserItem;
  clientId?: string;
  historySummary?: string;
  metadata?: {
    model?: string;
    provider?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicListRequest {
  sessionId: string; // 会话 ID
}

export interface TopicCreateRequest {
  title: string;
  sessionId: string;
  favorite?: boolean;
}

export interface TopicSummaryRequest {
  model?: string;
  provider?: string;
}

/**
 * 获取会话的所有话题
 * @description 获取指定会话的所有话题列表，符合文档规范的路径参数方式
 * @param sessionId string
 * @returns TopicItem[]
 */
function getTopicList(sessionId: string) {
  return http.get<TopicItem[]>(`/api/v1/topics/${sessionId}`);
}

/**
 * 创建话题
 * @description 创建新的话题
 * @param data TopicCreateRequest
 * @returns TopicItem
 */
function createTopic(data: TopicCreateRequest) {
  return http.post<TopicItem>('/api/v1/topics', data);
}

/**
 * 话题总结
 * @description 对指定话题进行总结
 * @param id string
 * @param data TopicSummaryRequest
 * @returns TopicItem
 */
function summaryTopic(id: string, data?: TopicSummaryRequest) {
  return http.post<TopicItem>(`/api/v1/topics/${id}/summary`, data || {});
}

/**
 * 删除话题
 * @description 删除指定的话题
 * @param id string
 * @returns void
 */
function deleteTopic(id: string) {
  return http.delete<void>(`/api/v1/topics/${id}`);
}

export default {
  getTopicList,
  createTopic,
  summaryTopic,
  deleteTopic,
};
