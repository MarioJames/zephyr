import { UserItem } from '@/services/user';

export interface UserPreference {
  guide?: {
    topic?: boolean;
    moveSettingsToAvatar?: boolean;
  };
  useCmdEnterToSend?: boolean;
  sendWithEnter?: boolean;
}

export interface UserState {
  user?: UserItem;
  preference: UserPreference;
  isLogin: boolean;
  isLoading: boolean;
  error?: string;
}

export const initialState: UserState = {
  user: undefined,
  preference: {
    guide: {
      topic: true,
      moveSettingsToAvatar: true,
    },
    useCmdEnterToSend: false,
    sendWithEnter: true,
  },
  isLogin: false,
  isLoading: false,
  error: undefined,
};