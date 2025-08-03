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

// 定义扩展的 Session 类型，用于内部使用
interface ExtendedSession {
  accessToken?: string;
  bearerToken?: string;
  expiresAt?: number;
}

const baseURL = process.env.NEXT_PUBLIC_LOBE_HOST || 'http://localhost:3010';

// 简单的内存缓存
interface TokenCache {
  accessToken: string | null;
  bearerToken: string | null;
  expiresAt: number | null | undefined;
  lastFetched: number;
}

let tokenCache: TokenCache = {
  accessToken: null,
  bearerToken: null,
  expiresAt: null,
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

// 同步获取当前有效的id token
async function getCurrentIdToken(): Promise<string | null> {
  try {
    // 1. 优先检查内存缓存
    if (isCacheValid() && tokenCache.bearerToken) {
      console.debug('使用缓存的bearerToken');
      return tokenCache.bearerToken;
    }

    // 2. 检查是否已有进行中的session请求，如果有则等待
    if (sessionPromise) {
      console.debug('等待进行中的session请求');
      const session = await sessionPromise;
      const extendedSession = session as ExtendedSession;
      return extendedSession?.bearerToken || null;
    }

    // 3. 创建新的session请求（只有第一个请求会执行到这里）
    console.debug('创建新的session请求');
    sessionPromise = getSession();

    try {
      const session = await sessionPromise;
      const extendedSession = session as ExtendedSession;

      if (extendedSession?.bearerToken) {
        const bearerToken = extendedSession.bearerToken;
        const sessionExpiresAt = extendedSession.expiresAt;

        // 更新内存缓存
        tokenCache.bearerToken = bearerToken;
        tokenCache.expiresAt = sessionExpiresAt;
        tokenCache.lastFetched = Date.now();

        console.debug('session请求成功，缓存已更新');
      }

      return extendedSession?.bearerToken || null;
    } finally {
      // 只有创建sessionPromise的请求才负责清除，确保在主线程中同步清除
      sessionPromise = null;
    }
    
  } catch (error) {
    console.warn('Failed to get id token:', error);
    // 确保异常时也清除Promise缓存
    sessionPromise = null;
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
      console.debug('token过期，通过getCurrentIdToken重新获取');
      const token = await getCurrentIdToken();
      if (token) {
        // token已通过getCurrentIdToken更新到缓存，直接重试请求
        return instance(error.config);
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
