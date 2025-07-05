import { initialUploadState } from './slices/upload/initialState';
import { initialMessageState } from './slices/message/initialState';
import { initialTopicState } from './slices/topic/initialState';
import { initialAgentSuggestionsState } from './slices/agent_suggestions/initialState';
import { MessageState } from './slices/message/initialState';
import { TopicState } from './slices/topic/initialState';
import { UploadState } from './slices/upload/initialState';
import { AgentSuggestionsState } from './slices/agent_suggestions/initialState';

export interface ChatState
  extends MessageState,
    TopicState,
    UploadState,
    AgentSuggestionsState {
  error?: string;
}

export const initialState: ChatState = {
  ...initialMessageState,
  ...initialUploadState,
  ...initialTopicState,
  ...initialAgentSuggestionsState,

  error: undefined,
};
