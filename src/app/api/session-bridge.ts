// 会话 API 桥接 - 重定向到 services
import { sessionsAPI } from '@/services';

export const sessionApi = {
  // 重定向所有方法到新的 services API
  ...sessionsAPI,
  
  // 保持旧的方法名兼容性
  getSessions: sessionsAPI.getSessionList || (() => Promise.resolve([])),
  createSession: sessionsAPI.createSession || (() => Promise.resolve('')),
  updateSession: sessionsAPI.updateSession || (() => Promise.resolve()),
  removeSession: sessionsAPI.deleteSession || (() => Promise.resolve()),
  searchSessions: sessionsAPI.searchSessions || (() => Promise.resolve([])),
  cloneSession: sessionsAPI.cloneSession || (() => Promise.resolve('')),
};

export default sessionApi;