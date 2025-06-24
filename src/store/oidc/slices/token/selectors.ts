import { OIDCStore } from '../../store';

/**
 * OIDC Token相关的状态选择器
 */
export const oidcTokenSelectors = {
  // 基础状态选择器
  tokenInfo: (s: OIDCStore) => s.tokenInfo,
  isRefreshing: (s: OIDCStore) => s.isRefreshing,
  lastRefreshTime: (s: OIDCStore) => s.lastRefreshTime,
  
  // Token信息提取
  accessToken: (s: OIDCStore) => s.tokenInfo?.accessToken || null,
  refreshToken: (s: OIDCStore) => s.tokenInfo?.refreshToken || null,
  tokenType: (s: OIDCStore) => s.tokenInfo?.tokenType || 'Bearer',
  expiresAt: (s: OIDCStore) => s.tokenInfo?.expiresAt || 0,
  scopes: (s: OIDCStore) => s.tokenInfo?.scopes || [],
  
  // 复合选择器
  hasValidToken: (s: OIDCStore) => {
    if (!s.tokenInfo) return false;
    const now = Date.now() / 1000;
    return now < s.tokenInfo.expiresAt;
  },
  
  timeUntilExpiry: (s: OIDCStore) => {
    if (!s.tokenInfo) return 0;
    const now = Date.now() / 1000;
    return Math.max(0, s.tokenInfo.expiresAt - now);
  },
};