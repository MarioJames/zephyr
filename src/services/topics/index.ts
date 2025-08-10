import { http } from '../request';
import { UserItem } from '../user';
import chatService from '../chat';
import messagesAPI, { MessageItem } from '../messages';

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

export interface TopicCreateRequest {
  title: string;
  sessionId: string;
  favorite?: boolean;
  [key: string]: unknown;
}

export interface TopicTitleSummaryRequest {
  id: string;
  lang?: string;
  [key: string]: unknown;
}

export interface TopicUpdateRequest {
  title: string;
  [key: string]: unknown;
}

/**
 * 获取会话的所有话题
 * @description 获取指定会话的所有话题列表，符合文档规范的路径参数方式
 * @param sessionId string
 * @returns TopicItem[]
 */
function getTopicList(sessionId: string, params?: { keyword?: string }) {
  return http.get<TopicItem[]>(`/api/v1/topics/session/${sessionId}`, {
    params,
  });
}

/**
 * 获取话题详情
 * @description 获取指定话题的详情
 * @param id string
 * @returns TopicItem
 */
function getTopicDetail(id: string) {
  return http.get<TopicItem>(`/api/v1/topics/${id}`);
}

/**
 * 更新话题
 * @description 更新指定话题的信息
 * @param id string
 * @param data TopicUpdateRequest
 * @returns TopicItem
 */
function updateTopic(id: string, data: TopicUpdateRequest) {
  return http.put<TopicItem>(`/api/v1/topics/${id}`, data);
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
 * 总结话题标题
 * @description 基于chat接口对指定话题进行总结标题
 * @param data TopicTitleSummaryRequest
 * @returns Promise<string> 返回生成的标题
 */
async function summaryTopicTitle(data?: TopicTitleSummaryRequest): Promise<string> {
  if (!data?.id) {
    throw new Error('话题ID不能为空');
  }

  try {
    // 获取话题下的所有消息
    const topicMessages: MessageItem[] = await messagesAPI.queryByTopic(data.id);

    // 如果没有消息，返回默认标题
    if (topicMessages.length === 0) {
      return '默认话题';
    }

    // 构建消息历史用于摘要生成，按照后端逻辑
    // 按时间排序，最早的对话在最上面
    const sortedMessages = topicMessages.sort((a, b) => 
      new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
    
    const messagesContent = sortedMessages
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');

    // 构建总结标题的prompt，参照后端实现
    const systemPrompt = '你是一名擅长会话的助理，你需要将用户的会话总结为 10 个字以内的标题';
    
    const userPrompt = `${messagesContent}

  请总结上述对话为10个字以内的标题，不要添加标点符号，输出语言语种为：'zh-CN'，标题要简洁明了，便于用户理解，如果对话内容很少或不清晰，生成一个通用但有意义的标题`;

    const response = await chatService.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const title = response.content?.trim() || '默认话题';
    // 移除可能的引号和标点符号
    return title.replaceAll(/^["']|["']$/g, '').replaceAll(/[。！，：；？]/g, '');
  } catch (error) {
    console.error('生成话题标题失败:', error);
    throw new Error('生成话题标题失败');
  }
}

export default {
  getTopicList,
  getTopicDetail,
  createTopic,
  summaryTopicTitle,
  updateTopic,
  deleteTopic,
};
