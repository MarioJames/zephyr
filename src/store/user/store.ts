import { create } from 'zustand';
import { StateCreator } from 'zustand/vanilla';

import { AuthAction, authSlice } from './slices/auth/action';
import { PreferenceAction, preferenceSlice } from './slices/preference/action';
import { UserState, initialState } from './initialState';

export interface UserStore extends UserState, AuthAction, PreferenceAction {}

const createStore: StateCreator<UserStore> = (...parameters) => ({
  ...initialState,
  ...authSlice(...parameters),
  ...preferenceSlice(...parameters),
});

export const useUserStore = create<UserStore>()(createStore);