export interface SessionActiveState {
  activeSessionId?: string;
  activeTopicId?: string;
  targetUserId?: string;
}

export const sessionActiveInitialState: SessionActiveState = {
  activeSessionId: undefined,
  activeTopicId: undefined,
  targetUserId: undefined,
};
