// 聊天 API 桥接 - 重定向到 services
import { chatAPI } from '@/services';

export const chatApi = {
  // 重定向所有方法到新的 services API
  ...chatAPI,
  
  // 保持旧的方法名兼容性
  chat: chatAPI.chat || (() => Promise.resolve()),
  generateReply: chatAPI.generateReply || (() => Promise.resolve()),
  translate: chatAPI.translate || (() => Promise.resolve()),
};

export default chatApi;