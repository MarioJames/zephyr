import { OIDCStore } from '../../store';

/**
 * OIDC认证相关的状态选择器
 */
export const oidcAuthSelectors = {
  // 基础状态选择器
  user: (s: OIDCStore) => s.user,
  isLoading: (s: OIDCStore) => s.isLoading,
  isAuthenticated: (s: OIDCStore) => s.isAuthenticated,
  error: (s: OIDCStore) => s.error,
  
  // 复合选择器
  isReady: (s: OIDCStore) => !s.isLoading,
  hasError: (s: OIDCStore) => !!s.error,
  
  // 用户信息提取
  userId: (s: OIDCStore) => s.user?.profile?.sub || null,
  userEmail: (s: OIDCStore) => s.user?.profile?.email || null,
  userName: (s: OIDCStore) => s.user?.profile?.name || null,
};