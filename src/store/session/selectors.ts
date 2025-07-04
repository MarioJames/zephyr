import { sessionActiveSelectors } from './slices/active/selectors';
import { SessionStore } from './store';

// 基础会话选择器
export const sessionSelectors = {
  ...sessionActiveSelectors,

  // 获取搜索结果
  searchResults: (state: SessionStore) => state.searchResults,

  // 根据ID获取会话
  getSessionById: (state: SessionStore) => (id: string) =>
    state.sessions.find((session) => session.id === id),

  // 获取搜索关键词
  searchKeyword: (state: SessionStore) => state.searchKeyword,

  // 获取最近会话（自动按 updatedAt 排序，前5个）
  recentSessions: (state: SessionStore) =>
    [...state.sessions]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
      )
      .slice(0, 5),
};
