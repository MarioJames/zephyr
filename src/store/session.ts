import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

// 定义会话元数据类型
interface SessionMeta {
  title: string;
  avatar?: string;
  backgroundColor?: string;
  // 可以添加更多元数据字段
}

// 定义会话类型
interface Session {
  id: string;
  meta: SessionMeta;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

// 这里定义 SessionState 类型和初始状态
export interface SessionState {
  sessions: Session[];
  activeId: string | null;
  setActiveSession: (sessionId: string) => void;
  addSession: (session: any) => void;
  removeSession: (sessionId: string) => void;
  togglePinSession: (sessionId: string) => void;
}

const initialState: SessionState = {
  sessions: [],
  activeId: null,
  setActiveSession: () => {},
  addSession: () => {},
  removeSession: () => {},
  togglePinSession: () => {},
};

const createStore = (set: any, get: any): SessionState => ({
  ...initialState,
  setActiveSession: (sessionId: string) => {
    set({ activeId: sessionId });
  },
  addSession: (session: any) => {
    const newSession = {
      id: Date.now().toString(),
      meta: {
        title: session.title,
        avatar: session.avatar,
        backgroundColor: session.backgroundColor,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };
    set({
      sessions: [...get().sessions, newSession],
      activeId: newSession.id,
    });
  },
  removeSession: (sessionId: string) => {
    set({
      sessions: get().sessions.filter((s: any) => s.id !== sessionId),
      activeId: get().activeId === sessionId ? null : get().activeId,
    });
  },
  togglePinSession: (sessionId: string) => {
    set({
      sessions: get().sessions.map((session: any) =>
        session.id === sessionId
          ? { ...session, isPinned: !session.isPinned, updatedAt: new Date() }
          : session
      ),
    });
  },
});

export const useSessionStore = createWithEqualityFn<SessionState>()(
  subscribeWithSelector(createStore),
  shallow,
);

export const getSessionStoreState = () => useSessionStore.getState();

export const sessionSelectors = {
  pinnedSessions: (state: SessionState) => state.sessions.filter((session) => session.isPinned),
  activeSession: (state: SessionState) => state.sessions.find((session) => session.id === state.activeId),
};

export const sessionHelpers = {
  getTitle: (meta: SessionMeta) => meta.title,
  getAvatar: (meta: SessionMeta) => meta.avatar,
};