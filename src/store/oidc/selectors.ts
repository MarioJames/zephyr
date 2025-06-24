// 导出所有slice的选择器
export { oidcAuthSelectors } from './slices/auth/selectors';
export { oidcTokenSelectors } from './slices/token/selectors';
export { oidcUserSelectors } from './slices/user/selectors';

// 可以在这里添加跨slice的复合选择器
import { OIDCStore } from './store';

/**
 * 跨slice的复合选择器
 */
export const oidcSelectors = {
  // 完整的认证状态
  fullAuthState: (s: OIDCStore) => ({
    isAuthenticated: s.isAuthenticated,
    user: s.user,
    userInfo: s.userInfo,
    tokenInfo: s.tokenInfo,
    isLoading: s.isLoading || s.isLoadingUserInfo,
    error: s.error,
  }),
  
  // 是否完全就绪（包括用户信息）
  isFullyReady: (s: OIDCStore) => 
    s.isAuthenticated && 
    !s.isLoading && 
    !s.isLoadingUserInfo && 
    !!s.userInfo,
    
  // 获取完整的用户标识信息
  userIdentity: (s: OIDCStore) => ({
    id: s.userInfo?.id || s.user?.profile?.sub,
    email: s.userInfo?.email || s.user?.profile?.email,
    name: s.userInfo?.name || s.user?.profile?.name,
  }),
};