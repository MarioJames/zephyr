export interface UserPreference {
  guide?: {
    topic?: boolean;
    moveSettingsToAvatar?: boolean;
  };
  useCmdEnterToSend?: boolean;
  sendWithEnter?: boolean;
}

export interface PreferenceState {
  preference: UserPreference;
}

export const initialPreferenceState: PreferenceState = {
  preference: {
    guide: {
      topic: true,
      moveSettingsToAvatar: true,
    },
    useCmdEnterToSend: false,
    sendWithEnter: true,
  },
};