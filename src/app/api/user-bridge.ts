// 用户 API 桥接 - 重定向到 services
import { userAPI } from '@/services';

export const userApi = {
  // 重定向所有方法到新的 services API
  ...userAPI,
  
  // 保持旧的方法名兼容性
  getUserInfo: userAPI.getUserInfo || (() => Promise.resolve({})),
  updateUser: userAPI.updateUser || (() => Promise.resolve()),
  createUser: userAPI.createUser || (() => Promise.resolve('')),
  deleteUser: userAPI.deleteUser || (() => Promise.resolve()),
};

export default userApi;