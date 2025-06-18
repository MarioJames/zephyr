import { request } from './index';
import topicMock from '../mock/topic';

export const topicApi = {
  /**
   * 创建新主题
   * @param params CreateTopicParams 创建参数
   * @returns Promise<string> 新主题ID
   */
  createTopic: (data: any) =>
    topicMock['/topic/createTopic']?.(data) || request('/topic/createTopic', data),
  /**
   * 批量创建主题
   * @param topics any 导入的主题数组
   * @returns Promise<any> 批量任务结果
   */
  batchCreateTopics: (data: any) =>
    topicMock['/topic/batchCreateTopics']?.(data) || request('/topic/batchCreateTopics', data),
  /**
   * 克隆主题
   * @param id string 主题ID
   * @param newTitle string 新标题
   * @returns Promise<string> 新主题ID
   */
  cloneTopic: (data: any) =>
    topicMock['/topic/cloneTopic']?.(data) || request('/topic/cloneTopic', data),
  /**
   * 获取主题列表
   * @param params any 查询参数（如 sessionId）
   * @returns Promise<ChatTopic[]> 主题数组
   */
  getTopics: (data: any) =>
    topicMock['/topic/getTopics']?.(data) || request('/topic/getTopics', data),
  /**
   * 搜索主题
   * @param keyword string 关键词
   * @param sessionId string 会话ID
   * @returns Promise<ChatTopic[]> 主题数组
   */
  searchTopics: (data: any) =>
    topicMock['/topic/searchTopics']?.(data) || request('/topic/searchTopics', data),
  /**
   * 获取所有主题
   * @returns Promise<ChatTopic[]> 主题数组
   */
  getAllTopics: (data: any) =>
    topicMock['/topic/getAllTopics']?.(data) || request('/topic/getAllTopics', data),
  /**
   * 统计主题数量
   * @param params any 可选参数
   * @returns Promise<number> 数量
   */
  countTopics: (data: any) =>
    topicMock['/topic/countTopics']?.(data) || request('/topic/countTopics', data),
  /**
   * 获取主题排行
   * @param limit number 数量限制
   * @returns Promise<TopicRankItem[]> 排行数组
   */
  rankTopics: (data: any) =>
    topicMock['/topic/rankTopics']?.(data) || request('/topic/rankTopics', data),
  /**
   * 更新主题
   * @param id string 主题ID
   * @param data any 更新内容
   * @returns Promise<any>
   */
  updateTopic: (data: any) =>
    topicMock['/topic/updateTopic']?.(data) || request('/topic/updateTopic', data),
  /**
   * 删除单个主题
   * @param id string 主题ID
   * @returns Promise<any>
   */
  removeTopic: (data: any) =>
    topicMock['/topic/removeTopic']?.(data) || request('/topic/removeTopic', data),
  /**
   * 删除会话下所有主题
   * @param sessionId string 会话ID
   * @returns Promise<any>
   */
  removeTopics: (data: any) =>
    topicMock['/topic/removeTopics']?.(data) || request('/topic/removeTopics', data),
  /**
   * 批量删除主题
   * @param topics string[] 主题ID数组
   * @returns Promise<any>
   */
  batchRemoveTopics: (data: any) =>
    topicMock['/topic/batchRemoveTopics']?.(data) || request('/topic/batchRemoveTopics', data),
  /**
   * 删除所有主题
   * @returns Promise<any>
   */
  removeAllTopic: (data: any) =>
    topicMock['/topic/removeAllTopic']?.(data) || request('/topic/removeAllTopic', data),
}; 


// 
/* eslint-disable typescript-sort-keys/interface */
import { BatchTaskResult } from '@/types/service';
import { ChatTopic, TopicRankItem } from '@/types/topic';

export interface CreateTopicParams {
  messages?: string[];
  sessionId?: string | null;
  title: string;
}

export interface QueryTopicParams {
  current?: number;
  pageSize?: number;
  sessionId: string;
}

export interface ITopicService {
  createTopic(params: CreateTopicParams): Promise<string>;
  batchCreateTopics(importTopics: ChatTopic[]): Promise<BatchTaskResult>;
  cloneTopic(id: string, newTitle?: string): Promise<string>;

  getTopics(params: QueryTopicParams): Promise<ChatTopic[]>;
  getAllTopics(): Promise<ChatTopic[]>;
  countTopics(params?: {
    endDate?: string;
    range?: [string, string];
    startDate?: string;
  }): Promise<number>;
  rankTopics(limit?: number): Promise<TopicRankItem[]>;
  searchTopics(keyword: string, sessionId?: string): Promise<ChatTopic[]>;

  updateTopic(id: string, data: Partial<ChatTopic>): Promise<any>;

  removeTopic(id: string): Promise<any>;
  removeTopics(sessionId: string): Promise<any>;
  batchRemoveTopics(topics: string[]): Promise<any>;
  removeAllTopic(): Promise<any>;
}
