import { StateCreator } from 'zustand';
import { ChatStore } from '../../store';
import qs from 'query-string';

export interface SessionAction {
  // 会话管理
  switchSession: (sessionId: string) => void;
}

export const sessionSlice: StateCreator<ChatStore, [], [], SessionAction> = (
  set,
  get
) => ({
  switchSession: async (sessionId: string) => {
    // 获取新会话的话题列表
    let activeTopicId = undefined;

    if (qs.parse(window.location.search).topicId) {
      activeTopicId = qs.parse(window.location.search).topicId as string;
    } else {
      const topics = await get().fetchTopics(sessionId);

      activeTopicId = topics?.[0]?.id;
    }

    set({
      activeTopicId,
      activeSessionId: sessionId,
      messages: [],
      messagesInit: false,
      topics: [],
      topicsInit: false,
    });
  },
});
