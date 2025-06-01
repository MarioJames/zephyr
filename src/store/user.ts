import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

// 定义用户状态类型
interface UserState {
  // 认证相关状态
  isLoggedIn: boolean;
  token: string | null;
  
  // 用户资料相关状态
  username: string | null;
  avatar: string | null;
  email: string | null;
  
  // 操作方法
  login: (data: { token: string; username: string; avatar?: string; email?: string }) => void;
  logout: () => void;
  updateProfile: (profile: Partial<{ username: string; avatar: string; email: string }>) => void;
}

const initialState: UserState = {
  isLoggedIn: false,
  token: null,
  username: null,
  avatar: null,
  email: null,
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
};

const createStore = (set: any, get: any): UserState => ({
  ...initialState,
  login: (data) => {
    set({
      isLoggedIn: true,
      token: data.token,
      username: data.username,
      avatar: data.avatar || null,
      email: data.email || null,
    });
  },
  logout: () => {
    set({
      isLoggedIn: false,
      token: null,
      username: null,
      avatar: null,
      email: null,
    });
  },
  updateProfile: (profile) => {
    set({
      username: profile.username || get().username,
      avatar: profile.avatar || get().avatar,
      email: profile.email || get().email,
    });
  },
});

export const useUserStore = createWithEqualityFn<UserState>()(
  subscribeWithSelector(createStore),
  shallow,
);

export const getUserStoreState = () => useUserStore.getState();

// 选择器函数
const authSelectors = {
  isLogin: (state: UserState) => state.isLoggedIn,
};

const userProfileSelectors = {
  username: (state: UserState) => state.username,
  userAvatar: (state: UserState) => state.avatar,
  email: (state: UserState) => state.email,
};

export { authSelectors, userProfileSelectors };