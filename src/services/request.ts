import { useOIDCStore } from '@/store/oidc';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// token获取与存储工具
function getAccessToken() {
  return localStorage.getItem('accessToken') || '';
}
function getRefreshToken() {
  return localStorage.getItem('refreshToken') || '';
}
function setAccessToken(token: string) {
  localStorage.setItem('accessToken', token);
}
function setRefreshToken(token: string) {
  localStorage.setItem('refreshToken', token);
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: process.env.LOBE_HOST,
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
    if (now < oidcState.tokenInfo.expiresAt - 60) { // 提前60秒认为过期
      return oidcState.tokenInfo.accessToken;
    }
  }
  
  // fallback到localStorage中的token
  return getAccessToken() || null;
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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
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
        
        // fallback到传统的token刷新方式
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const res = await axios.post(
            `${process.env.LOBE_HOST}/auth/refresh-token`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );
          const { accessToken: newToken, refreshToken: newRefreshToken } = res.data;
          setAccessToken(newToken);
          setRefreshToken(newRefreshToken);
          onRefreshed(newToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          return instance(originalRequest);
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
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const method = (config?.method || 'post') as AxiosRequestConfig['method'];
  const reqConfig: AxiosRequestConfig = {
    url: `http://localhost:3010${api}`,
    method,
    ...config,
  };
  if (method === 'get') {
    reqConfig.params = data;
  } else {
    reqConfig.data = data;
  }
  const res = await instance.request<T>(reqConfig);
  return res.data;
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
