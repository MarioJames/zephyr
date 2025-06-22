import { Session, User } from '@auth/core/types';
import {
  ActiveSessionResource,
  SignInProps,
  SignOut,
  UserProfileProps,
  UserResource,
} from '@clerk/types';

import { LobeUser } from '@/types/user';

/**
 * 用户认证状态接口
 * 定义了用户认证相关的所有状态字段
 */
export interface UserAuthState {
  // Clerk相关功能函数
  clerkOpenUserProfile?: (props?: UserProfileProps) => void;

  // Clerk认证状态
  clerkSession?: ActiveSessionResource;
  clerkSignIn?: (props?: SignInProps) => void;
  clerkSignOut?: SignOut;
  clerkUser?: UserResource;
  isLoaded?: boolean;

  // NextAuth相关状态
  isSignedIn?: boolean;
  nextSession?: Session;
  nextUser?: User;
  oAuthSSOProviders?: string[];

  // 应用用户信息
  user?: LobeUser;
}

/**
 * 认证状态的初始值
 * 所有字段都设为undefined，表示初始状态为空
 */
export const initialAuthState: UserAuthState = {};
