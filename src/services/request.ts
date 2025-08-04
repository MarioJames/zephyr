import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession, signIn } from 'next-auth/react';
import { shouldReLogin, getValidAccessToken } from '@/libs/auth';

// 扩展 Session 类型以包含自定义属性
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

// 定义扩展的 Session 类型，用于内部使用
interface ExtendedSession {
  accessToken?: string;
  error?: string;
}

const baseURL = process.env.NEXT_PUBLIC_LOBE_HOST || 'http://localhost:3010';

// 简单的内存缓存
interface TokenCache {
  accessToken: string | null;
  hasError: boolean;
  lastFetched: number;
}

let tokenCache: TokenCache = {
  accessToken: null,
  hasError: false,
  lastFetched: 0,
};

// Promise缓存，用于防止并发请求导致多个session请求
let sessionPromise: Promise<any> | null = null;

// 缓存有效期（5分钟）
const CACHE_DURATION = 5 * 60 * 1000;

// 检查缓存是否有效（只检查缓存时间，不检查token过期）
function isCacheValid(): boolean {
  const now = Date.now();
  const cacheAge = now - tokenCache.lastFetched;

  // 缓存时间超过5分钟则失效
  return cacheAge <= CACHE_DURATION;
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  timeout: 300_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 获取当前有效的 access token
async function getCurrentAccessToken(): Promise<string | null> {
  try {
    // 1. 优先检查内存缓存
    if (isCacheValid() && tokenCache.accessToken && !tokenCache.hasError) {
      console.debug('使用缓存的accessToken');
      return tokenCache.accessToken;
    }

    // 2. 检查是否已有进行中的session请求，如果有则等待
    if (sessionPromise) {
      console.debug('等待进行中的session请求');
      const session = await sessionPromise;
      const extendedSession = session as ExtendedSession;
      
      // 如果session有错误，返回null
      if (shouldReLogin(extendedSession)) {
        return null;
      }
      
      return getValidAccessToken(extendedSession);
    }

    // 3. 创建新的session请求（只有第一个请求会执行到这里）
    console.debug('创建新的session请求');
    sessionPromise = getSession();

    try {
      const session = await sessionPromise;
      const extendedSession = session as ExtendedSession;

      // 检查session是否需要重新登录
      if (shouldReLogin(extendedSession)) {
        console.warn('Token刷新失败，需要重新登录');
        tokenCache.hasError = true;
        tokenCache.accessToken = null;
        tokenCache.lastFetched = Date.now();
        return null;
      }

      const accessToken = getValidAccessToken(extendedSession);
      if (accessToken) {
        // 更新内存缓存
        tokenCache.accessToken = accessToken;
        tokenCache.hasError = false;
        tokenCache.lastFetched = Date.now();
        
        console.debug('session请求成功，缓存已更新');
      }

      return accessToken;
    } finally {
      // 只有创建sessionPromise的请求才负责清除，确保在主线程中同步清除
      sessionPromise = null;
    }
    
  } catch (error) {
    console.warn('Failed to get access token:', error);
    // 确保异常时也清除Promise缓存
    sessionPromise = null;
    tokenCache.hasError = true;
  }

  return null;
}

// 请求拦截器：自动带上accessToken
instance.interceptors.request.use(async (config) => {
  const token = await getCurrentAccessToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 添加重试标记以避免无限重试
const MAX_RETRY_COUNT = 1;

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error.response?.status;
    const config = error.config;

    // 避免无限重试
    if (config._retryCount >= MAX_RETRY_COUNT) {
      console.warn('已达到最大重试次数，停止重试');
      throw error;
    }

    // Token 过期或服务器错误时尝试刷新 token
    if ([401, 500].includes(status)) {
      console.debug(`收到${status}错误，尝试刷新token`);
      
      // 清除缓存，强制重新获取session
      tokenCache.accessToken = null;
      tokenCache.hasError = false;
      tokenCache.lastFetched = 0;
      
      const token = await getCurrentAccessToken();
      
      if (token) {
        // 设置重试标记
        config._retryCount = (config._retryCount || 0) + 1;
        console.debug('token刷新成功，重试请求');
        return instance(config);
      } else {
        // Token 刷新失败，触发重新登录
        console.warn('Token刷新失败，需要重新登录');
        if (typeof window !== 'undefined') {
          // 只在客户端环境下触发登录
          signIn();
        }
      }
    }

    throw error;
  }
);

// 定义 API 响应的通用结构
interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  timestamp?: number;
}

// 通用request方法，支持类型、方法、headers等
export async function request<T = unknown>(
  api: string,
  data?: ApiResponse<T>,
  config?: AxiosRequestConfig & { includeIdToken?: boolean }
): Promise<T> {
  const method = (config?.method || 'post') as AxiosRequestConfig['method'];
  const includeIdToken = config?.includeIdToken || false;

  const isOpenAPI = api.startsWith('/api/v1');

  let url = isOpenAPI ? `${baseURL}${api}` : api;

  // 如果需要在URL中包含access_token
  if (includeIdToken) {
    const accessToken = await getCurrentAccessToken();
    if (accessToken) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}access_token=${encodeURIComponent(accessToken)}`;
    }
  }

  const reqConfig: AxiosRequestConfig = {
    url,
    method,
    ...config,
  };

  // 移除自定义属性以避免axios报错
  delete (reqConfig as AxiosRequestConfig & { includeIdToken?: boolean })
    .includeIdToken;

  if (method === 'get') {
    reqConfig.params = data;
  } else {
    reqConfig.data = data;
  }

  const res = await instance.request<ApiResponse<T>>(reqConfig);

  if (res.data.success) {
    return res.data.data as T;
  } else {
    throw new Error(res.data.message);
  }
}

// 清除token缓存的工具函数
export function clearTokenCache() {
  tokenCache.accessToken = null;
  tokenCache.hasError = false;
  tokenCache.lastFetched = 0;
  sessionPromise = null;
  console.debug('Token缓存已清除');
}

// 检查当前session状态的工具函数
export async function checkSessionStatus() {
  const token = await getCurrentAccessToken();
  return {
    hasValidToken: !!token,
    hasError: tokenCache.hasError
  };
}

// http对象，简洁调用
export const http = {
  get<T = unknown>(
    api: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, params, { ...config, method: 'get' });
  },
  post<T = unknown>(
    api: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, data, { ...config, method: 'post' });
  },
  put<T = unknown>(
    api: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, data, { ...config, method: 'put' });
  },
  delete<T = unknown>(
    api: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, params, { ...config, method: 'delete' });
  },
};
