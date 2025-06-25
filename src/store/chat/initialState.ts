import { MessageItem } from '@/services';
import { TopicItem } from '@/services/topics';
import { initialUploadState } from './slices/upload/initialState';
import { initialSessionState } from './slices/session/initialState';
import { initialMessageState } from './slices/message/initialState';
import { initialTopicState } from './slices/topic/initialState';
import { SessionState } from './slices/session/initialState';
import { MessageState } from './slices/message/initialState';
import { TopicState } from './slices/topic/initialState';
import { UploadState } from './slices/upload/initialState';

export interface ChatState
  extends SessionState,
    MessageState,
    TopicState,
    UploadState {
  // 其他状态
  isLoading: boolean;
  error?: string;
}

export const initialState: ChatState = {
  ...initialSessionState,
  ...initialMessageState,
  ...initialUploadState,
  ...initialTopicState,

  isLoading: false,
  error: undefined,
};
