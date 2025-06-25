import { StateCreator } from 'zustand';
import { UserStore } from '../../store';
import { UserPreference } from './initialState';

export interface PreferenceAction {
  updatePreference: (preference: Partial<UserPreference>) => void;
  updateGuideState: (key: string, value: boolean) => void;
  resetPreference: () => void;
}

export const preferenceSlice: StateCreator<
  UserStore,
  [],
  [],
  PreferenceAction
> = (set, get) => ({
  updatePreference: (newPreference: Partial<UserPreference>) => {
    set((state) => ({
      preference: {
        ...state.preference,
        ...newPreference,
      },
    }));
  },

  updateGuideState: (key: string, value: boolean) => {
    set((state) => ({
      preference: {
        ...state.preference,
        guide: {
          ...state.preference.guide,
          [key]: value,
        },
      },
    }));
  },

  resetPreference: () => {
    const { initialState } = require('../../initialState');
    set({ preference: initialState.preference });
  },
});