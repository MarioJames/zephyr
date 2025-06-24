// 话题 API 桥接 - 重定向到 services
import { topicsAPI } from '@/services';

export const topicApi = {
  // 重定向所有方法到新的 services API
  ...topicsAPI,
  
  // 保持旧的方法名兼容性
  getTopics: topicsAPI.getTopicsBySession || (() => Promise.resolve([])),
  createTopic: topicsAPI.createTopic || (() => Promise.resolve('')),
  removeTopic: topicsAPI.deleteTopic || (() => Promise.resolve()),
  updateTopic: topicsAPI.updateTopic || (() => Promise.resolve()),
  batchRemoveTopics: (() => Promise.resolve()),
  getTopicMessages: (() => Promise.resolve([])),
  updateTopicTitle: (() => Promise.resolve()),
};

export default topicApi;