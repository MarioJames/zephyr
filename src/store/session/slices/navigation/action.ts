import { StateCreator } from 'zustand';
import { SessionStore } from '@/store/session';
import { INBOX_SESSION_ID, SESSION_CHAT_URL } from '@/const/session';

export interface NavigationAction {
  // 切换会话
  switchSession: (sessionId: string) => void;
  // 切换到上一个会话
  switchToPreviousSession: () => void;
  // 切换到收件箱
  switchToInbox: () => void;
  // 添加会话到历史记录
  addToHistory: (sessionId: string) => void;
  // 清除导航历史
  clearHistory: () => void;
  // 设置当前会话
  setCurrentSession: (sessionId?: string) => void;
  // 设置切换状态
  setSwitching: (switching: boolean) => void;
}

export const navigationSlice: StateCreator<
  SessionStore,
  [],
  [],
  NavigationAction
> = (set, get) => ({
  switchSession: (sessionId: string) => {
    const currentSessionId = get().currentSessionId;

    // 如果切换到相同会话，直接返回
    if (currentSessionId === sessionId) return;

    set({ isSwitching: true });

    try {
      // 添加当前会话到历史记录
      if (currentSessionId) {
        get().addToHistory(currentSessionId);
      }

      // 设置新的当前会话
      set({
        previousSessionId: currentSessionId,
        currentSessionId: sessionId,
        isSwitching: false
      });

      // 获取会话详情（如果不在缓存中）
      const sessions = get().sessions;
      const sessionExists = sessions.find(s => s.id === sessionId);

      if (!sessionExists && sessionId !== INBOX_SESSION_ID) {
        get().fetchSessionDetail(sessionId);
      }

      // 导航到会话页面
      if (typeof window !== 'undefined') {
        const url = SESSION_CHAT_URL(sessionId);
        window.history.pushState(null, '', url);
      }
    } catch (error) {
      console.error('切换会话失败:', error);
      set({ isSwitching: false });
    }
  },

  switchToPreviousSession: () => {
    const previousSessionId = get().previousSessionId;
    if (previousSessionId) {
      get().switchSession(previousSessionId);
    }
  },

  switchToInbox: () => {
    get().switchSession(INBOX_SESSION_ID);
  },

  addToHistory: (sessionId: string) => {
    const { navigationHistory, maxHistorySize } = get();

    // 移除重复项
    const filteredHistory = navigationHistory.filter(id => id !== sessionId);

    // 添加到历史记录开头
    const newHistory = [sessionId, ...filteredHistory];

    // 限制历史记录数量
    if (newHistory.length > maxHistorySize) {
      newHistory.splice(maxHistorySize);
    }

    set({ navigationHistory: newHistory });
  },

  clearHistory: () => {
    set({ navigationHistory: [] });
  },

  setCurrentSession: (sessionId?: string) => {
    const currentSessionId = get().currentSessionId;

    set({
      previousSessionId: currentSessionId,
      currentSessionId: sessionId
    });

    // 获取会话详情
    if (sessionId && sessionId !== INBOX_SESSION_ID) {
      get().fetchSessionDetail(sessionId);
    }
  },

  setSwitching: (switching: boolean) => {
    set({ isSwitching: switching });
  },
});
