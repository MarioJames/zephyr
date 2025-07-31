import type { 
  User, 
  
  
  
  
} from '@clerk/backend';

// 定义用户创建参数类型（基于 Clerk 的实际 API）
export interface CreateUserParams {
  emailAddress?: string[];
  phoneNumber?: string[];
  password?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  publicMetadata?: Record<string, unknown>;
  privateMetadata?: Record<string, unknown>;
  unsafeMetadata?: Record<string, unknown>;
  skipPasswordChecks?: boolean;
  skipPasswordRequirement?: boolean;
  totpSecret?: string;
  backupCodes?: string[];
  externalId?: string;
}

// 定义用户更新参数类型
export interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  removePassword?: boolean;
  signOutOfOtherSessions?: boolean;
  primaryEmailAddressID?: string;
  primaryPhoneNumberID?: string;
  primaryWeb3WalletID?: string;
  profileImageID?: string;
  publicMetadata?: Record<string, unknown>;
  privateMetadata?: Record<string, unknown>;
  unsafeMetadata?: Record<string, unknown>;
  deleteProfileImage?: boolean;
  createdAt?: Date;
  passwordDigest?: string;
  skipPasswordChecks?: boolean;
  totpSecret?: string;
  backupCodes?: string[];
  externalId?: string;
}

// 重新导出 Clerk 类型


// 用户查询选项
export interface UserQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  query?: string;
}

// 密码重置选项
export interface PasswordResetOptions {
  userId: string;
  customEmailTemplate?: string;
  redirectUrl?: string;
}

// API 响应类型
export interface ClerkApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// 用户列表响应类型
export interface UserListResponse {
  data: User[];
  totalCount: number;
}

// 服务方法的返回类型
export type ServiceResult<T> = Promise<ClerkApiResponse<T>>;
export {type ClerkClient,type EmailAddress, type Organization, type Session, type User} from '@clerk/backend';