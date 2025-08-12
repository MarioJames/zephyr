import dayjs from 'dayjs';
import { message } from 'antd';

import { COOKIE_CACHE_DAYS } from '@/const/settings';

export const setCookie = (
  key: string,
  value: string | undefined,
  expireDays = COOKIE_CACHE_DAYS
) => {
  if (typeof document === 'undefined') return;

  if (typeof value === 'undefined') {
    // Set the expiration time to yesterday (expire immediately)
    const expiredDate = new Date(0).toUTCString(); // 1970-01-01T00:00:00Z

    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = `${key}=; expires=${expiredDate}; path=/;`;
  } else {
    const expires = dayjs().add(expireDays, 'day').toDate().toUTCString();

    // eslint-disable-next-line unicorn/no-document-cookie
    document.cookie = `${key}=${value};expires=${expires};path=/;`;
  }
};

/**
 * 清除所有应用相关的cookie和本地存储
 * 用于退出登录时的数据清理
 */
export const clearAllAppData = () => {
  if (typeof window === 'undefined') return;

  // NextAuth相关的cookie名称
  const authCookies = [
    'authjs.session-token',
    'authjs.csrf-token', 
    'authjs.callback-url',
    'authjs.pkce.code_verifier',
    'next-auth.session-token',
    'next-auth.csrf-token',
    'next-auth.callback-url',
    'next-auth.pkce.code_verifier',
    '__Secure-authjs.session-token',
    '__Secure-next-auth.session-token'
  ];

  // 清除认证相关cookie
  authCookies.forEach(cookieName => {
    setCookie(cookieName, undefined);
  });

  // 清除应用特定的localStorage项
  const localStorageKeys = [
    'zephyr-session',
    'theme-mode',
    'user-preferences'
  ];

  localStorageKeys.forEach(key => {
    localStorage.removeItem(key);
  });

  // 清除sessionStorage
  sessionStorage.clear();
};

/**
 * 全局退出登录函数
 * 清除所有用户状态、会话数据和认证信息，然后跳转到登录页
 */
export const logout = async () => {
  try {
    // 动态导入必要的模块
    const [
      { useGlobalStore },
      { signOut },
      { zephyrEnv }
    ] = await Promise.all([
      import('@/store/global'),
      import('next-auth/react'),
      import('@/env/zephyr')
    ]);

    // 1. 清除全局用户状态
    const { clearUserState } = useGlobalStore.getState();
    clearUserState();
    
    // 2. 清除会话、聊天和角色状态
    if (typeof window !== 'undefined') {
      // 动态导入store来避免循环依赖
      const [{ useSessionStore }, { useChatStore }, { useRoleStore }] = await Promise.all([
        import('@/store/session'),
        import('@/store/chat'),
        import('@/store/role')
      ]);
      
      // 清除会话状态
      const { resetActiveState } = useSessionStore.getState();
      resetActiveState();
      
      // 清除聊天状态  
      const { resetChatState } = useChatStore.getState();
      resetChatState();
      
      // 清除角色状态
      const { setCurrentRole } = useRoleStore.getState();
      setCurrentRole(null);
    }
    
    // 3. 清除所有应用数据（cookie、localStorage、sessionStorage）
    clearAllAppData();
    
    // 4. 调用NextAuth的signOut方法
    await signOut({ 
      redirectTo: zephyrEnv.NEXT_PUBLIC_APP_URL,
      redirect: true 
    });
    
    message.success('退出登录成功');
  } catch (error) {
    console.error('退出登录失败:', error);
    message.error('退出登录失败，请重试');
  }
};
