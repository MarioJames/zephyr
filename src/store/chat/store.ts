import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { MessageAction, messageSlice } from './slices/message/action';
import { TopicAction, topicSlice } from './slices/topic/action';
import { SessionAction, sessionSlice } from './slices/session/action';
import { ChatState, initialState } from './initialState';

export interface ChatStore extends ChatState, MessageAction, TopicAction, SessionAction {}

const createStore: StateCreator<ChatStore> = (...parameters) => ({
  ...initialState,
  ...messageSlice(...parameters),
  ...topicSlice(...parameters),
  ...sessionSlice(...parameters),
});

export const useChatStore = create<ChatStore>()(createStore);