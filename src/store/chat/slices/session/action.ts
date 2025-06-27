import { StateCreator } from 'zustand';
import { ChatStore } from '../../store';

export interface SessionAction {
  // 会话管理
  switchSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
}

export const sessionSlice: StateCreator<
  ChatStore,
  [],
  [],
  SessionAction
> = (set, get) => ({
  switchSession: (sessionId: string) => {
    set({
      activeSessionId: sessionId,
      activeTopicId: undefined,
      messages: [],
      messagesInit: false,
      topics: [],
      topicsInit: false,
    });

    // 获取新会话的话题列表
    get().fetchTopics(sessionId);
  },

  setActiveSession: (sessionId: string) => {
    set({ activeSessionId: sessionId });
  },
});
