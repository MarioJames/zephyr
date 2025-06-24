import isEqual from 'fast-deep-equal';
import useSWR, { SWRResponse, mutate } from 'swr';
import { DeepPartial } from 'utility-types';
import { StateCreator } from 'zustand/vanilla';

import { message } from '@/components/AntdStaticMethods';
import { MESSAGE_CANCEL_FLAT } from '@/const/message';
import { DEFAULT_AGENT_LOBE_SESSION, INBOX_SESSION_ID } from '@/const/session';
import { useClientDataSWR } from '@/libs/swr';
import { sessionApi } from '@/app/api';
import { SessionStore } from '@/store/session';
import { useUserStore } from '@/store/user';
import { settingsSelectors } from '@/store/user/selectors';
import { MetaData } from '@/types/meta';
import {
  ChatSessionList,
  LobeAgentSession,
  LobeSessionType,
  LobeSessions,
  UpdateSessionParams,
} from '@/types/session';
import { merge } from '@/utils/merge';

import { SessionDispatch, sessionsReducer } from './reducers';
import { sessionSelectors } from './selectors';
import { sessionMetaSelectors } from './selectors/meta';

export interface SessionAction {
  switchSession: (sessionId: string) => void;
  clearSessions: () => Promise<void>;
  createSession: (
    session?: DeepPartial<LobeAgentSession>,
    isSwitchSession?: boolean,
  ) => Promise<string>;
  duplicateSession: (id: string) => Promise<void>;
  triggerSessionUpdate: (id: string) => Promise<void>;
  updateSessionMeta: (meta: Partial<MetaData>) => void;
  pinSession: (id: string, pinned: boolean) => Promise<void>;
  refreshSessions: () => Promise<void>;
  removeSession: (id: string) => Promise<void>;
  updateSearchKeywords: (keywords: string) => void;
  useFetchSessions: (
    enabled: boolean,
    isLogin: boolean | undefined,
  ) => SWRResponse<ChatSessionList>;
  useSearchSessions: (keyword?: string) => SWRResponse<any>;
  internal_dispatchSessions: (payload: SessionDispatch) => void;
  internal_updateSession: (id: string, data: Partial<UpdateSessionParams>) => Promise<void>;
  internal_processSessions: (
    sessions: LobeSessions,
    actions?: string,
  ) => void;
}

export const createSessionSlice: StateCreator<
  SessionStore,
  [['zustand/devtools', never]],
  [],
  SessionAction
> = (set, get) => ({
  clearSessions: async () => {
    await sessionApi.removeAllSessions();
    await get().refreshSessions();
  },

  createSession: async (agent, isSwitchSession = true) => {
    const { switchSession, refreshSessions } = get();

    const defaultAgent = merge(
      DEFAULT_AGENT_LOBE_SESSION,
      settingsSelectors.defaultAgent(useUserStore.getState()),
    );

    const newSession: LobeAgentSession = merge(defaultAgent, agent);

    const id = await sessionApi.createSession(LobeSessionType.Agent, newSession);
    await refreshSessions();

    if (isSwitchSession) switchSession(id);

    return id;
  },
  duplicateSession: async (id) => {
    const { switchSession, refreshSessions } = get();
    const session = sessionSelectors.getSessionById(id)(get());

    if (!session) return;
    const title = sessionMetaSelectors.getTitle(session.meta);

    const newTitle = `${title}（副本）`;

    const messageLoadingKey = 'duplicateSession.loading';

    message.loading({
      content: '正在复制会话...',
      duration: 0,
      key: messageLoadingKey,
    });

    const newId = await sessionApi.cloneSession(id, newTitle);

    if (!newId) {
      message.destroy(messageLoadingKey);
      message.error('复制失败');
      return;
    }

    await refreshSessions();
    message.destroy(messageLoadingKey);
    message.success('复制成功');

    switchSession(newId);
  },
  pinSession: async (id, pinned) => {
    await get().internal_updateSession(id, { pinned });
  },
  removeSession: async (sessionId) => {
    await sessionApi.removeSession(sessionId);
    await get().refreshSessions();

    if (sessionId === get().activeId) {
      get().switchSession(INBOX_SESSION_ID);
    }
  },

  switchSession: (sessionId) => {
    if (get().activeId === sessionId) return;

    set({ activeId: sessionId }, false, n(`activeSession/${sessionId}`));
  },

  triggerSessionUpdate: async (id) => {
    await get().internal_updateSession(id, { updatedAt: new Date() });
  },

  updateSearchKeywords: (keywords) => {
    set(
      { isSearching: !!keywords, sessionSearchKeywords: keywords },
      false,
      n('updateSearchKeywords'),
    );
  },

  updateSessionMeta: async (meta) => {
    const session = sessionSelectors.currentSession(get());
    if (!session) return;

    const { activeId, refreshSessions } = get();

    const abortController = get().signalSessionMeta as AbortController;
    if (abortController) abortController.abort(MESSAGE_CANCEL_FLAT);
    const controller = new AbortController();
    set({ signalSessionMeta: controller }, false, 'updateSessionMetaSignal');

    await sessionApi.updateSessionMeta(activeId, meta, controller.signal);
    await refreshSessions();
  },

  useFetchSessions: (enabled, isLogin) =>
    useClientDataSWR<ChatSessionList>(
      enabled ? [FETCH_SESSIONS_KEY, isLogin] : null,
      () => sessionApi.getGroupedSessions(),
      {
        fallbackData: {
          sessions: [],
        },
        onSuccess: (data) => {
          if (
            get().isSessionsFirstFetchFinished &&
            isEqual(get().sessions, data.sessions)
          )
            return;

          get().internal_processSessions(
            data.sessions,
            n('useFetchSessions/updateData') as any,
          );
          set({ isSessionsFirstFetchFinished: true }, false, n('useFetchSessions/onSuccess', data));
        },
        suspense: true,
      },
    ),
  useSearchSessions: (keyword) =>
    useSWR<LobeSessions>(
      ['searchSessions', keyword],
      async () => {
        if (!keyword) return [];

        return sessionApi.searchSessions(keyword);
      },
      { revalidateOnFocus: false, revalidateOnMount: false },
    ),

  internal_dispatchSessions: (payload) => {
    const nextSessions = sessionsReducer(get().sessions, payload);
    get().internal_processSessions(nextSessions);
  },
  internal_updateSession: async (id, data) => {
    get().internal_dispatchSessions({ type: 'updateSession', id, value: data });

    await sessionApi.updateSession(id, data);
    await get().refreshSessions();
  },
  internal_processSessions: (sessions) => {
    const defaultGroup = sessions.filter(
      (item) => !item.pinned,
    );
    const pinnedGroup = sessions.filter((item) => item.pinned);

    set(
      {
        defaultSessions: defaultGroup,
        pinnedSessions: pinnedGroup,
        sessions,
      },
      false,
      n('processSessions'),
    );
  },
  refreshSessions: async () => {
    await mutate([FETCH_SESSIONS_KEY, true]);
  },
});
