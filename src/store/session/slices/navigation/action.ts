import { StateCreator } from 'zustand';
import { SessionStore } from '@/store/session';
import { INBOX_SESSION_ID, SESSION_CHAT_URL } from '@/const/session';
import { useAgentStore } from '@/store/agent';

export interface NavigationAction {
  // 切换会话
  switchSession: (sessionId: string) => Promise<void>;
  // 切换到上一个会话
  switchToPreviousSession: () => Promise<void>;
  // 切换到收件箱
  switchToInbox: () => Promise<void>;
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
  switchSession: async (sessionId: string) => {
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
        isSwitching: false,
      });

      // 获取会话详情并加载相关的智能体和模型信息
      const sessions = get().sessions;
      const existingSession = sessions.find((s) => s.id === sessionId);

      if (sessionId !== INBOX_SESSION_ID) {
        let sessionDetail = existingSession;

        // 如果会话不在缓存中，获取会话详情
        if (!existingSession) {
          sessionDetail = await get().fetchSessionDetail(sessionId);
        }

        // 如果会话有关联的智能体，加载智能体信息和模型详情
        if (sessionDetail?.agent?.id) {
          const agentStore = useAgentStore.getState();

          // 加载智能体信息
          await agentStore.loadAgentById(sessionDetail.agent?.id);

          // 获取当前智能体的模型信息
          const currentAgent = agentStore.currentAgent;
          if (currentAgent?.model && currentAgent?.provider) {
            // 获取模型详情
            await agentStore.fetchModelDetails(
              currentAgent.model,
              currentAgent.provider
            );
          }
        }
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

  switchToPreviousSession: async () => {
    const previousSessionId = get().previousSessionId;
    if (previousSessionId) {
      await get().switchSession(previousSessionId);
    }
  },

  switchToInbox: async () => {
    await get().switchSession(INBOX_SESSION_ID);
  },

  addToHistory: (sessionId: string) => {
    const { navigationHistory, maxHistorySize } = get();

    // 移除重复项
    const filteredHistory = navigationHistory.filter((id) => id !== sessionId);

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
      currentSessionId: sessionId,
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
