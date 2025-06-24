// 导入各个slice的状态类型和初始状态
import { OIDCAuthState, initialOIDCAuthState } from './slices/auth/initialState';
import { OIDCTokenState, initialOIDCTokenState } from './slices/token/initialState';
import { OIDCUserState, initialOIDCUserState } from './slices/user/initialState';

/**
 * OIDC状态的完整类型定义
 * 通过交叉类型(&)将所有子模块的状态组合在一起
 */
export type OIDCState = OIDCAuthState & OIDCTokenState & OIDCUserState;

/**
 * OIDC Store的初始状态
 * 通过展开操作符(...)将所有子模块的初始状态合并
 */
export const initialState: OIDCState = {
  ...initialOIDCAuthState,
  ...initialOIDCTokenState,
  ...initialOIDCUserState,
};