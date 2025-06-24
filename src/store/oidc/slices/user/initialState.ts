import { UserItem } from '@/services/user';

/**
 * OIDC用户信息状态接口
 */
export interface OIDCUserState {
  // 用户信息
  userInfo: UserItem | null;
  
  // 加载状态
  isLoadingUserInfo: boolean;
}

/**
 * OIDC用户信息状态的初始值
 */
export const initialOIDCUserState: OIDCUserState = {
  userInfo: null,
  isLoadingUserInfo: false,
};