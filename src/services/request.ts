import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

// 扩展 Session 类型以包含自定义属性
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    idToken?: string;
    expiresAt?: number;
  }
}

const baseURL = process.env.NEXT_PUBLIC_LOBE_HOST || 'http://localhost:3010';

// 简单的内存缓存
interface TokenCache {
  accessToken: string | null;
  idToken: string | null;
  expiresAt: number | null;
  lastFetched: number;
}

let tokenCache: TokenCache = {
  accessToken: null,
  idToken: null,
  expiresAt: null,
  lastFetched: 0,
};

// 缓存有效期（5分钟）
const CACHE_DURATION = 5 * 60 * 1000;

// 清除内存缓存
function clearTokenCache() {
  tokenCache = {
    accessToken: null,
    idToken: null,
    expiresAt: null,
    lastFetched: 0,
  };
}

// 检查缓存是否有效（只检查缓存时间，不检查token过期）
function isCacheValid(): boolean {
  const now = Date.now();
  const cacheAge = now - tokenCache.lastFetched;

  // 缓存时间超过5分钟则失效
  return cacheAge <= CACHE_DURATION;
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 同步获取当前有效的id token
async function getCurrentIdToken(): Promise<string | null> {
  try {
    // 1. 优先检查内存缓存
    if (isCacheValid() && tokenCache.idToken) {
      return tokenCache.idToken;
    }

    // 2. 从 NextAuth session 获取
    const session = await getSession();
    if ((session as any)?.idToken) {
      const idToken = (session as any).idToken;
      const sessionExpiresAt = (session as any).expiresAt;

      // 更新内存缓存
      tokenCache.idToken = idToken;
      tokenCache.expiresAt = sessionExpiresAt;
      tokenCache.lastFetched = Date.now();

      return idToken;
    }
  } catch (error) {
    console.warn('Failed to get id token:', error);
  }

  return null;
}

// 请求拦截器：自动带上accessToken
instance.interceptors.request.use(async (config) => {
  const token = await getCurrentIdToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const status = error.response?.status;

    // Token 过期时，重新获取token
    if ([401, 403, 500].includes(status)) {
      const session = await getSession();
      if ((session as any)?.idToken) {
        const idToken = (session as any).idToken;
        const sessionExpiresAt = (session as any).expiresAt;

        // 更新内存缓存
        tokenCache.idToken = idToken;
        tokenCache.expiresAt = sessionExpiresAt;
        tokenCache.lastFetched = Date.now();

        return instance(error.config);
      }
    }

    return Promise.reject(error);
  }
);

// 通用request方法，支持类型、方法、headers等
export async function request<T = any>(
  api: string,
  data?: {
    data?: T;
    success?: boolean;
    message?: string;
    timestamp?: number;
  },
  config?: AxiosRequestConfig & { includeIdToken?: boolean }
): Promise<T> {
  const method = (config?.method || 'post') as AxiosRequestConfig['method'];
  const includeIdToken = config?.includeIdToken || false;

  const isOpenAPI = api.startsWith('/api/v1');

  let url = isOpenAPI ? `${baseURL}${api}` : api;

  // 如果需要在URL中包含id_token
  if (includeIdToken) {
    const idToken = await getCurrentIdToken();
    if (idToken) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}id_token=${encodeURIComponent(idToken)}`;
    }
  }

  const reqConfig: AxiosRequestConfig = {
    url,
    method,
    ...config,
  };

  // 移除自定义属性以避免axios报错
  delete (reqConfig as any).includeIdToken;

  if (method === 'get') {
    reqConfig.params = data;
  } else {
    reqConfig.data = data;
  }

  const res = await instance.request<{
    data?: T;
    success?: boolean;
    message?: string;
    timestamp?: number;
  }>(reqConfig);

  if (res.data.success) {
    return res.data.data as T;
  } else {
    throw new Error(res.data.message);
  }
}

// http对象，简洁调用
export const http = {
  get<T = any>(
    api: string,
    params?: any,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, params, { ...config, method: 'get' });
  },
  post<T = any>(
    api: string,
    data?: any,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, data, { ...config, method: 'post' });
  },
  put<T = any>(
    api: string,
    data?: any,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, data, { ...config, method: 'put' });
  },
  delete<T = any>(
    api: string,
    params?: any,
    config?: AxiosRequestConfig & { includeIdToken?: boolean }
  ) {
    return request<T>(api, params, { ...config, method: 'delete' });
  },
};
