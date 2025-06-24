import { OIDCStore } from '../../store';

/**
 * OIDC用户信息相关的状态选择器
 */
export const oidcUserSelectors = {
  // 基础状态选择器
  userInfo: (s: OIDCStore) => s.userInfo,
  isLoadingUserInfo: (s: OIDCStore) => s.isLoadingUserInfo,
  
  // 用户信息提取
  userInfoId: (s: OIDCStore) => s.userInfo?.id || null,
  userInfoEmail: (s: OIDCStore) => s.userInfo?.email || null,
  userInfoName: (s: OIDCStore) => s.userInfo?.name || null,
  
  // 复合选择器
  hasUserInfo: (s: OIDCStore) => !!s.userInfo,
  isUserInfoReady: (s: OIDCStore) => !s.isLoadingUserInfo && !!s.userInfo,
};