import { useOIDCStore } from '@/store/oidc';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_LOBE_HOST || 'http://localhost:3010';

// 创建axios实例
const instance: AxiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 同步获取当前有效的access token
function getCurrentAccessToken(): string | null {
  const oidcState = useOIDCStore.getState();

  // 优先使用OIDC token（如果已认证且token未过期）
  if (oidcState.isAuthenticated && oidcState.tokenInfo) {
    const now = Date.now() / 1000;
    // 检查token是否还有效（未过期且不是即将过期）
    if (now < oidcState.tokenInfo.expiresAt - 60) {
      // 提前60秒认为过期
      return oidcState.tokenInfo.accessToken;
    }
  }

  return null;
}

// 请求拦截器：自动带上accessToken
instance.interceptors.request.use((config) => {
  const token = getCurrentAccessToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：处理token过期自动刷新
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // 队列等待token刷新
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(instance(originalRequest));
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const oidcState = useOIDCStore.getState();

        // 优先尝试使用OIDC的token刷新机制
        if (oidcState.isAuthenticated && oidcState.refreshTokens) {
          const success = await oidcState.refreshTokens();
          if (success) {
            const newToken = oidcState.tokenInfo?.accessToken;
            if (newToken) {
              onRefreshed(newToken);
              originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
              return instance(originalRequest);
            }
          }
        }

        // 没有可用的刷新token，跳转登录
        throw new Error('No refresh token available');
      } catch (refreshError) {
        // 刷新失败，清除状态并跳转登录
        const oidcState = useOIDCStore.getState();
        if (oidcState.clearState) {
          oidcState.clearState();
        }
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
  config?: AxiosRequestConfig
): Promise<T> {
  const method = (config?.method || 'post') as AxiosRequestConfig['method'];

  const isOpenAPI = api.startsWith('/api/v1');

  const reqConfig: AxiosRequestConfig = {
    url: isOpenAPI ? `${baseURL}${api}` : api,
    method,
    ...config,
  };
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
  get<T = any>(api: string, params?: any, config?: AxiosRequestConfig) {
    return request<T>(api, params, { ...config, method: 'get' });
  },
  post<T = any>(api: string, data?: any, config?: AxiosRequestConfig) {
    return request<T>(api, data, { ...config, method: 'post' });
  },
  put<T = any>(api: string, data?: any, config?: AxiosRequestConfig) {
    return request<T>(api, data, { ...config, method: 'put' });
  },
  delete<T = any>(api: string, params?: any, config?: AxiosRequestConfig) {
    return request<T>(api, params, { ...config, method: 'delete' });
  },
};
