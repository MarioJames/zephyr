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

// 请求拦截器：自动带上accessToken
instance.interceptors.request.use((config) => {
  const token = getAccessToken();
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
        const refreshToken = getRefreshToken();
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
      } catch (refreshError) {
        // 刷新失败，跳转登录
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    // 其他错误处理
    // if (error.response) {
    //   switch (error.response.status) {
    //     case 403:
    //       window.location.href = '/403';
    //       break;
    //     case 404:
    //       window.location.href = '/404';
    //       break;
    //     case 500:
    //       window.location.href = '/500';
    //       break;
    //     default:
    //       break;
    //   }
    // }
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
    url: api,
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
};
