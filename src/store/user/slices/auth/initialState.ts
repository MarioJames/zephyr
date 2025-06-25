import { UserItem } from '@/services/user';

export interface AuthState {
  user?: UserItem;
  isLogin: boolean;
  isLoading: boolean;
  error?: string;
}

export const initialAuthState: AuthState = {
  user: undefined,
  isLogin: false,
  isLoading: false,
  error: undefined,
};