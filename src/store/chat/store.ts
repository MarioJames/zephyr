import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { MessageAction, messageSlice } from './slices/message/action';
import { TopicAction, topicSlice } from './slices/topic/action';
import { SessionAction, sessionSlice } from './slices/session/action';
import { ChatState, initialState } from './initialState';
import { UploadAction } from './slices/upload/action';
import { uploadSlice } from './slices/upload/action';

export interface ChatStore
  extends ChatState,
    MessageAction,
    TopicAction,
    SessionAction,
    UploadAction {}

const createStore: StateCreator<ChatStore> = (...parameters) => ({
  ...initialState,
  ...messageSlice(...parameters),
  ...topicSlice(...parameters),
  ...sessionSlice(...parameters),
  ...uploadSlice(...parameters),
});

export const useChatStore = create<ChatStore>()(createStore);
