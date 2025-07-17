import { UserItem } from "@/services";

export interface SessionActiveState {
  activeSessionId?: string;
  activeTopicId?: string;
  targetUserId?: string;
  targetUser?: UserItem;
}

export const sessionActiveInitialState: SessionActiveState = {
  activeSessionId: undefined,
  activeTopicId: undefined,
  targetUserId: undefined,
  targetUser: undefined,
};
