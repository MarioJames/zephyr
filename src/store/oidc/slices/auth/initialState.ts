import { User } from 'oidc-client-ts';

/**
 * OIDC认证状态接口
 * 定义了OIDC认证相关的所有状态字段
 */
export interface OIDCAuthState {
  // 认证用户对象
  user: User | null;
  
  // 认证状态
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // 错误状态
  error: Error | null;
}

/**
 * OIDC认证状态的初始值
 */
export const initialOIDCAuthState: OIDCAuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};