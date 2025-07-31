import { initialUploadState , UploadState } from './slices/upload/initialState';
import { initialMessageState , MessageState } from './slices/message/initialState';
import { initialTopicState , TopicState } from './slices/topic/initialState';
import { initialAgentSuggestionsState , AgentSuggestionsState } from './slices/agent_suggestions/initialState';

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
