// 消息 API 桥接 - 重定向到 services
import { messagesAPI } from '@/services';

export const messageApi = {
  // 重定向所有方法到新的 services API
  ...messagesAPI,
  
  // 保持旧的方法名兼容性
  getMessages: messagesAPI.getMessagesByTopic || (() => Promise.resolve([])),
  createMessage: messagesAPI.createMessage || (() => Promise.resolve('')),
  updateMessage: messagesAPI.updateMessage || (() => Promise.resolve()),
  removeMessage: messagesAPI.deleteMessage || (() => Promise.resolve()),
  removeMessages: (() => Promise.resolve()),
  removeMessagesByAssistant: (() => Promise.resolve()),
  removeAllMessages: (() => Promise.resolve()),
  updateMessagePluginError: (() => Promise.resolve()),
};

export default messageApi;