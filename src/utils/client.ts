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
 * 清除所有应用相关的本地存储
 * 用于退出登录时的数据清理
 */
export const clearAllAppData = () => {
  if (typeof window === 'undefined') return;

  // 清除应用特定的localStorage项
  const localStorageKeys = [
    'zephyr-session',
    'theme-mode',
    'user-preferences'
  ];

  localStorageKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[Logout] 清除 localStorage 项 ${key} 失败:`, error);
    }
  });

  // 清除sessionStorage
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('[Logout] 清除 sessionStorage 失败:', error);
  }
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
      { clearTokenCache }
    ] = await Promise.all([
      import('@/store/global'),
      import('next-auth/react'),
      import('@/services/request')
    ]);

    // 1. 清除request.ts中的token缓存
    clearTokenCache();

    // 2. 调用OIDC End Session端点
    try {
      await fetch('/oidc/session/end', {
        method: 'GET',
        credentials: 'include' // 确保包含cookie
      });
    } catch (error) {
      console.error('[Logout] OIDC End Session失败:', error);
    }

    // 3. 调用后端API清除所有cookie
    try {
      await fetch('/api/auth/logout', { 
        method: 'DELETE',
        credentials: 'include' // 确保包含cookie
      });
    } catch (error) {
      console.error('[Logout] 调用后端登出API失败:', error);
    }

    // 4. 清除全局用户状态
    const { clearUserState } = useGlobalStore.getState();
    clearUserState();
    
    // 5. 清除会话、聊天和角色状态
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
    
    // 6. 清除所有本地存储数据
    clearAllAppData();
    
    // 7. 立即重定向到登录页
    window.location.href = '/login';
    
    // 8. 调用NextAuth的signOut方法（后台执行，不等待）
    signOut({ 
      redirect: false // 禁用自动重定向
    }).catch(error => {
      console.error('[Logout] NextAuth登出失败:', error);
    });
    
    message.success('退出登录成功');
  } catch (error) {
    console.error('[Logout] 退出登录失败:', error);
    message.error('退出登录失败，请重试');
    // 即使失败也尝试重定向到登录页
    window.location.href = '/login';
  }
};
