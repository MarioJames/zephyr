import { StateCreator } from 'zustand/vanilla';

import { enableAuth, enableClerk, enableNextAuth } from '@/const/auth';

import { UserStore } from '../../store';

/**
 * 用户认证操作接口
 * 定义了用户认证相关的所有操作方法
 */
export interface UserAuthAction {
  /**
   * 检查是否启用认证功能
   * @returns 是否启用认证
   */
  enableAuth: () => boolean;
  
  /**
   * 通用登出方法
   * 支持Clerk和NextAuth两种认证方式
   * 根据当前启用的认证方式执行相应的登出逻辑
   */
  logout: () => Promise<void>;
  
  /**
   * 通用登录方法
   * 支持Clerk和NextAuth两种认证方式
   * 根据当前启用的认证方式执行相应的登录逻辑
   */
  openLogin: () => Promise<void>;
}

/**
 * 创建认证操作slice的工厂函数
 * 返回包含所有认证相关操作的对象
 */
export const createAuthSlice: StateCreator<
  UserStore,
  [['zustand/devtools', never]],
  [],
  UserAuthAction
> = (set, get) => ({
  /**
   * 检查是否启用认证功能
   * 返回全局认证配置中的enableAuth值
   */
  enableAuth: () => {
    return enableAuth;
  },
  
  /**
   * 通用登出方法
   * 根据启用的认证方式执行相应的登出逻辑
   */
  logout: async () => {
    // 如果启用Clerk认证
    if (enableClerk) {
      // 调用Clerk的登出方法，重定向到当前页面
      get().clerkSignOut?.({ redirectUrl: location.toString() });
      return;
    }

    // 如果启用NextAuth认证
    if (enableNextAuth) {
      // 动态导入NextAuth的signOut方法
      const { signOut } = await import('next-auth/react');
      // 执行NextAuth登出
      signOut();
    }
  },
  
  /**
   * 通用登录方法
   * 根据启用的认证方式执行相应的登录逻辑
   */
  openLogin: async () => {
    // 如果启用Clerk认证
    if (enableClerk) {
      const reditectUrl = location.toString();
      // 调用Clerk的登录方法，设置重定向URL和注册URL
      get().clerkSignIn?.({
        fallbackRedirectUrl: reditectUrl, // 登录失败后的重定向URL
        signUpForceRedirectUrl: reditectUrl, // 注册后的强制重定向URL
        signUpUrl: '/signup', // 注册页面URL
      });
      return;
    }

    // 如果启用NextAuth认证
    if (enableNextAuth) {
      // 动态导入NextAuth的signIn方法
      const { signIn } = await import('next-auth/react');
      // 检查是否只有一个OAuth提供商可用
      const providers = get()?.oAuthSSOProviders;
      if (providers && providers.length === 1) {
        // 如果只有一个提供商，直接使用该提供商登录
        signIn(providers[0]);
        return;
      }
      // 否则显示登录选择页面
      signIn();
    }
  },
});
