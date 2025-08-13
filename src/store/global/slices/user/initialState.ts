import { UserItem } from '@/services/user';

/**
 * User Slice 状态接口
 */
export interface UserState {
  /**
   * 用户信息是否初始化完成
   */
  userInit: boolean;

  /**
   * 用户凭证是否初始化完成
   */
  userVirtualKeyInit: boolean;

  /**
   * 当前用户信息
   * 存储当前登录用户的详细信息
   */
  currentUser: UserItem | null;

  /**
   * 虚拟密钥
   * 用户的虚拟API密钥
   */
  virtualKey: string | null;

  /**
   * 用户相关错误
   * 存储用户操作相关的错误信息
   */
  userError: Error | null;
}

export const userInitialState: UserState = {
  currentUser: null,
  userInit: false,
  userVirtualKeyInit: false,
  virtualKey: null,
  userError: null,
};
