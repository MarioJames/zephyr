import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';

import { MessageAction, messageSlice } from './slices/message/action';
import { TopicAction, topicSlice } from './slices/topic/action';
import {
  AgentSuggestionsAction,
  agentSuggestionsSlice,
} from './slices/agent_suggestions/action';
import { ChatState, initialState } from './initialState';
import { UploadAction } from './slices/upload/action';
import { uploadSlice } from './slices/upload/action';
import { createDevtools } from '@/utils/store';
import { ChatCoreAction } from './slices/core/action';
import { chatCoreSlice } from './slices/core/action';

export interface ChatStore
  extends ChatState,
    MessageAction,
    TopicAction,
    UploadAction,
    AgentSuggestionsAction,
    ChatCoreAction {}

const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (
  ...parameters
) => ({
  ...initialState,
  ...messageSlice(...parameters),
  ...topicSlice(...parameters),
  ...uploadSlice(...parameters),
  ...agentSuggestionsSlice(...parameters),
  ...chatCoreSlice(...parameters),
});

//  ===============  实装 useStore ============ //

const devtools = createDevtools('chat');

export const useChatStore = createWithEqualityFn<ChatStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow
);
