import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { MessageAction, messageSlice } from './slices/message/action';
import { TopicAction, topicSlice } from './slices/topic/action';
import { SessionAction, sessionSlice } from './slices/session/action';
import { AgentSuggestionsAction, agentSuggestionsSlice } from './slices/agent_suggestions/action';
import { ChatState, initialState } from './initialState';
import { UploadAction } from './slices/upload/action';
import { uploadSlice } from './slices/upload/action';
import { createDevtools } from '@/utils/store';

export interface ChatStore
  extends ChatState,
    MessageAction,
    TopicAction,
    SessionAction,
    UploadAction,
    AgentSuggestionsAction {}

const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (...parameters) => ({
  ...initialState,
  ...messageSlice(...parameters),
  ...topicSlice(...parameters),
  ...sessionSlice(...parameters),
  ...uploadSlice(...parameters),
  ...agentSuggestionsSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('chat');

export const useChatStore = createWithEqualityFn<ChatStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);
