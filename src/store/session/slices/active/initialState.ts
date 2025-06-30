export interface SessionActiveState {
  activeSessionId?: string;
  activeTopicId?: string;
}

export const sessionActiveInitialState: SessionActiveState = {
  activeSessionId: undefined,
  activeTopicId: undefined,
};
