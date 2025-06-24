/**
 * Token信息接口
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresAt: number; // Unix 时间戳
  scopes: string[];
}

/**
 * OIDC Token状态接口
 */
export interface OIDCTokenState {
  // Token信息
  tokenInfo: TokenInfo | null;
  
  // Token刷新相关
  isRefreshing: boolean;
  lastRefreshTime: number | null;
  refreshTimer: NodeJS.Timeout | null;
}

/**
 * OIDC Token状态的初始值
 */
export const initialOIDCTokenState: OIDCTokenState = {
  tokenInfo: null,
  isRefreshing: false,
  lastRefreshTime: null,
  refreshTimer: null,
};