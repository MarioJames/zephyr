import { StateCreator } from 'zustand';
import userService, { UserItem } from '@/services/user';
import { UserStore } from '../../store';

export interface AuthAction {
  login: (user: UserItem) => void;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (userData: Partial<UserItem>) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const authSlice: StateCreator<
  UserStore,
  [],
  [],
  AuthAction
> = (set, get) => ({
  login: (user: UserItem) => {
    set({ user, isLogin: true, error: undefined });
  },

  logout: () => {
    set({ 
      user: undefined, 
      isLogin: false, 
      error: undefined 
    });
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: undefined });
    try {
      const user = await userService.getCurrentUser();
      set({ 
        user, 
        isLogin: true, 
        isLoading: false,
        error: undefined 
      });
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        isLogin: false,
        user: undefined
      });
    }
  },

  updateUser: async (userData: Partial<UserItem>) => {
    const currentUser = get().user;
    if (!currentUser?.id) {
      throw new Error('No current user to update');
    }

    set({ isLoading: true, error: undefined });
    try {
      const updatedUser = await userService.updateUser(currentUser.id, userData);
      set({ 
        user: updatedUser, 
        isLoading: false,
        error: undefined 
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update user'
      });
      throw error;
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error?: string) => {
    set({ error });
  },
});