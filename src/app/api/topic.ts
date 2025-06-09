import { request } from './index';

export const topicApi = {
  /**
   * 创建新主题
   * @param params CreateTopicParams 创建参数
   * @returns Promise<string> 新主题ID
   */
  createTopic: (params: any) => request('/topic/createTopic', params),
  /**
   * 批量创建主题
   * @param topics any 导入的主题数组
   * @returns Promise<any> 批量任务结果
   */
  batchCreateTopics: (topics: any) => request('/topic/batchCreateTopics', { topics }),
  /**
   * 克隆主题
   * @param id string 主题ID
   * @param newTitle string 新标题
   * @returns Promise<string> 新主题ID
   */
  cloneTopic: (id: string, newTitle: string) => request('/topic/cloneTopic', { id, newTitle }),
  /**
   * 获取主题列表
   * @param params any 查询参数（如 sessionId）
   * @returns Promise<ChatTopic[]> 主题数组
   */
  getTopics: (params: any) => request('/topic/getTopics', params),
  /**
   * 搜索主题
   * @param keyword string 关键词
   * @param sessionId string 会话ID
   * @returns Promise<ChatTopic[]> 主题数组
   */
  searchTopics: (keyword: string, sessionId: string) => request('/topic/searchTopics', { keyword, sessionId }),
  /**
   * 获取所有主题
   * @returns Promise<ChatTopic[]> 主题数组
   */
  getAllTopics: () => request('/topic/getAllTopics', {}),
  /**
   * 统计主题数量
   * @param params any 可选参数
   * @returns Promise<number> 数量
   */
  countTopics: (params: any) => request('/topic/countTopics', params),
  /**
   * 获取主题排行
   * @param limit number 数量限制
   * @returns Promise<TopicRankItem[]> 排行数组
   */
  rankTopics: (limit: number) => request('/topic/rankTopics', { limit }),
  /**
   * 更新主题
   * @param id string 主题ID
   * @param data any 更新内容
   * @returns Promise<any>
   */
  updateTopic: (id: string, data: any) => request('/topic/updateTopic', { id, data }),
  /**
   * 删除单个主题
   * @param id string 主题ID
   * @returns Promise<any>
   */
  removeTopic: (id: string) => request('/topic/removeTopic', { id }),
  /**
   * 删除会话下所有主题
   * @param sessionId string 会话ID
   * @returns Promise<any>
   */
  removeTopics: (sessionId: string) => request('/topic/removeTopics', { sessionId }),
  /**
   * 批量删除主题
   * @param topics string[] 主题ID数组
   * @returns Promise<any>
   */
  batchRemoveTopics: (topics: string[]) => request('/topic/batchRemoveTopics', { topics }),
  /**
   * 删除所有主题
   * @returns Promise<any>
   */
  removeAllTopic: () => request('/topic/removeAllTopic', {}),
}; 


// 
/* eslint-disable typescript-sort-keys/interface */
import { BatchTaskResult } from '@/types/service';
import { ChatTopic, TopicRankItem } from '@/types/topic';

export interface CreateTopicParams {
  favorite?: boolean;
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
