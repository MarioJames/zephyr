import type { 
  User, 
  EmailAddress,
  Session,
  Organization,
  ClerkClient
} from '@clerk/backend';

// 定义用户创建参数类型（基于 Clerk 的实际 API）
export interface CreateUserParams {
  emailAddress?: string[];
  phoneNumber?: string[];
  password?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
  unsafeMetadata?: Record<string, any>;
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
  publicMetadata?: Record<string, any>;
  privateMetadata?: Record<string, any>;
  unsafeMetadata?: Record<string, any>;
  deleteProfileImage?: boolean;
  createdAt?: Date;
  passwordDigest?: string;
  skipPasswordChecks?: boolean;
  totpSecret?: string;
  backupCodes?: string[];
  externalId?: string;
}

// 重新导出 Clerk 类型
export type {
  User,
  EmailAddress,
  Session,
  Organization,
  ClerkClient
};

// 扩展的用户创建参数
export interface ExtendedCreateUserParams extends CreateUserParams {
  // 可以在这里添加项目特定的字段
}

// 扩展的用户更新参数
export interface ExtendedUpdateUserParams extends UpdateUserParams {
  // 可以在这里添加项目特定的字段
}

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

// 用户状态枚举
export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  LOCKED = 'locked',
  SUSPENDED = 'suspended'
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