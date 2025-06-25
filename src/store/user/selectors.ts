import { UserState } from './initialState';

const isLogin = (s: UserState): boolean => s.isLogin;
const user = (s: UserState) => s.user;
const isLoading = (s: UserState): boolean => s.isLoading;
const error = (s: UserState) => s.error;

// 认证相关选择器
export const authSelectors = {
  isLogin,
  user,
  isLoading,
  error,
};

// 偏好设置相关选择器
const useCmdEnterToSend = (s: UserState): boolean => 
  s.preference.useCmdEnterToSend ?? false;

const sendWithEnter = (s: UserState): boolean =>
  s.preference.sendWithEnter ?? true;

const guideState = (s: UserState) => s.preference.guide;

export const preferenceSelectors = {
  useCmdEnterToSend,
  sendWithEnter,
  guideState,
};