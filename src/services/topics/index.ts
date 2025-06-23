import { http } from "../request";

// 话题相关类型定义
export interface TopicItem {
  id: string;
  title?: string;
  favorite?: boolean;
  sessionId?: string;
  userId: string;
  clientId?: string;
  historySummary?: string;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopicListRequest {
  sessionId: string; // 会话 ID
}

export interface TopicCreateRequest {
  sessionId: string; // 会话 ID
  title: string; // 标题名称 - 默认标题
}

/**
 * 获取指定会话的所有话题
 * @description 查看某一个会话（客户）的所有历史记录（话题）时调用
 * @param params TopicListRequest
 * @returns TopicItem[]
 */
function getTopicList(params: TopicListRequest) {
  return http.get<TopicItem[]>("/api/v1/topics/list", params);
}

/**
 * 创建新的话题
 * @description 1创建完客户后默认创建一个话题，在对应话题下聊天 2在客户对话界面点击新开话题
 * @param data TopicCreateRequest
 * @returns TopicItem
 */
function createTopic(data: TopicCreateRequest) {
  return http.post<TopicItem>("/api/v1/topics/create", data);
}

/**
 * 总结对应的话题
 * @description 在客户对话界面点击新开话题，需要对当前的话题进行总结并归档
 * @param topicId string
 * @returns TopicItem
 */
function summaryTopic(topicId: string) {
  return http.post<TopicItem>("/api/v1/topics/summary", { topicId });
}

export default {
  getTopicList,
  createTopic,
  summaryTopic,
}; 