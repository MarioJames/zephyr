import { StateCreator } from 'zustand';
import { SessionStore } from '@/store/session';
import qs from 'query-string';
import { useGlobalStore } from '@/store/global';

export interface SessionActiveAction {
  initFromUrlParams: () => Promise<void>;
  setActiveSession: (sessionId: string) => void;
  setActiveTopic: (topicId: string) => void;
  setTargetUserId: (userId: string) => void;
  resetActiveState: () => void;
}

export const sessionActiveAction: StateCreator<
  SessionStore,
  [],
  [],
  SessionActiveAction
> = (set, get) => ({
  initFromUrlParams: async () => {
    const { session, topic, userId, openHistory } = qs.parse(window.location.search);

    // 如果URL参数中存在userId，则获取该员工的会话列表
    if (userId) {
      get().fetchSessions({ targetUserId: userId as string });
      set({ targetUserId: userId as string });
    }

    // 如果URL参数中存在session和topic，则切换会话和话题
    if (session) {
      get().switchSession(session as string, topic as string | undefined);
    }

    if (openHistory === '1') {
      console.log('检测到openHistory=true，打开历史面板');

      const { updateSystemStatus } = useGlobalStore.getState();

      updateSystemStatus({
        showSlotPanel: true,
        slotPanelType: 'history',
      });
    }
  },

  setActiveSession: (sessionId: string) => {
    set({ activeSessionId: sessionId });
  },

  setActiveTopic: (topicId: string) => {
    set({ activeTopicId: topicId });
  },

  setTargetUserId: (targetUserId: string) => {
    set({ targetUserId });
  },

  resetActiveState: () => {
    set({ activeSessionId: '', activeTopicId: '' });
  },
});
