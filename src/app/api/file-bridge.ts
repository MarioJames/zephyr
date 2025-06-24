// 文件 API 桥接 - 重定向到 services
import { filesAPI } from '@/services';

export const fileApi = {
  // 重定向所有方法到新的 services API
  ...filesAPI,
  
  // 保持旧的方法名兼容性
  uploadFile: filesAPI.uploadFile || (() => Promise.resolve({})),
  getFiles: filesAPI.getFileList || (() => Promise.resolve([])),
  deleteFile: filesAPI.deleteFile || (() => Promise.resolve()),
};

export default fileApi;