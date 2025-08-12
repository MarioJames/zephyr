import { http } from '../request';
import type { 
  CreateCasdoorUserParams, 
  UpdateCasdoorUserParams, 
  ChangePasswordRequest,
  ChangePasswordResponse
} from '@/types/casdoor';

// Casdoor 用户服务接口响应
export interface CasdoorApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
  details?: string;
}

/**
 * 创建 Casdoor 用户
 */
export const createCasdoorUser = async (
  userData: CreateCasdoorUserParams
): Promise<CasdoorApiResponse> => {
  const response = await http.post<CasdoorApiResponse>('/api/casdoor/users', userData);
  return response.data;
};

/**
 * 更新 Casdoor 用户
 */
export const updateCasdoorUser = async (
  userId: string,
  userData: Partial<UpdateCasdoorUserParams>
): Promise<CasdoorApiResponse> => {
  const response = await http.put<CasdoorApiResponse>(`/api/casdoor/users/${userId}`, userData);
  return response.data;
};

/**
 * 删除 Casdoor 用户
 */
export const deleteCasdoorUser = async (
  userId: string
): Promise<CasdoorApiResponse> => {
  const response = await http.delete<CasdoorApiResponse>(`/api/casdoor/users/${userId}`);
  return response.data;
};

/**
 * 修改用户密码
 */
export const changeUserPassword = async (
  passwordData: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response: any = await http.post('/api/casdoor/users/change-password', passwordData as any);
  return response.data;
};

// 导出所有 Casdoor 相关的服务方法
export const casdoorAPI = {
  createUser: createCasdoorUser,
  updateUser: updateCasdoorUser,
  deleteUser: deleteCasdoorUser,
  changePassword: changeUserPassword,
};