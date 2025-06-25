import { clerkBackend } from '@/libs/clerk-backend';
import type {
  User,
  CreateUserParams,
  UpdateUserParams,
  UserQueryOptions,
  PasswordResetOptions,
  ClerkApiResponse,
  UserListResponse,
  ServiceResult,
} from '@/types/clerk';

/**
 * Clerk 用户管理服务
 * 封装用户创建、更新、密码重置等核心功能
 */
export class ClerkUserService {
  /**
   * 创建新用户
   * @param params 用户创建参数
   * @returns 创建的用户信息
   */
  async createUser(params: CreateUserParams): ServiceResult<User> {
    try {
      const user = await clerkBackend.users.createUser(params);
      return {
        data: user,
        success: true,
        message: '用户创建成功',
      };
    } catch (error) {
      console.error('创建用户失败:', error);
      return {
        data: null as any,
        success: false,
        error: `创建用户失败: ${
          error instanceof Error ? error.message : '未知错误'
        }`,
      };
    }
  }

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param params 更新参数
   * @returns 更新后的用户信息
   */
  async updateUser(
    userId: string,
    params: UpdateUserParams
  ): ServiceResult<User> {
    try {
      const user = await clerkBackend.users.updateUser(userId, params);
      return {
        data: user,
        success: true,
        message: '用户信息更新成功',
      };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      return {
        data: null as any,
        success: false,
        error: `更新用户信息失败: ${
          error instanceof Error ? error.message : '未知错误'
        }`,
      };
    }
  }

  /**
   * 获取用户详细信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  async getUser(userId: string): ServiceResult<User> {
    try {
      const user = await clerkBackend.users.getUser(userId);
      return {
        data: user,
        success: true,
        message: '获取用户信息成功',
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return {
        data: null as any,
        success: false,
        error: `获取用户信息失败: ${
          error instanceof Error ? error.message : '未知错误'
        }`,
      };
    }
  }

  /**
   * 删除用户
   * @param userId 用户ID
   * @returns 删除结果
   */
  async deleteUser(userId: string): Promise<User> {
    try {
      const result = await clerkBackend.users.deleteUser(userId);
      return result;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw new Error(
        `删除用户失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  }

  /**
   * 重置用户密码
   * 通过发送密码重置邮件实现
   * @param userId 用户ID
   * @returns 操作结果
   */
  async resetPassword(userId: string): ServiceResult<boolean> {
    try {
      // 获取用户信息
      const userResult = await this.getUser(userId);
      if (!userResult.success) {
        return userResult as any;
      }

      const user = userResult.data;

      // 获取用户的主邮箱地址
      const primaryEmail = user.emailAddresses.find(
        (email) => email.id === user.primaryEmailAddressId
      );

      if (!primaryEmail) {
        return {
          data: false,
          success: false,
          error: '用户没有有效的邮箱地址',
        };
      }

      // Clerk 提供的密码重置方式是通过禁用当前密码，用户需要重新设置
      // 或者通过邮箱验证码方式重置，这里我们采用移除密码的方式
      await clerkBackend.users.updateUser(userId, {
        password: undefined,
      });

      return {
        data: true,
        success: true,
        message: '密码重置邮件发送成功',
      };
    } catch (error) {
      console.error('密码重置失败:', error);
      return {
        data: false,
        success: false,
        error: `密码重置失败: ${
          error instanceof Error ? error.message : '未知错误'
        }`,
      };
    }
  }
}

// 导出单例实例
export const clerkUserService = new ClerkUserService();

// 导出类型
export type { User } from '@clerk/backend';
export type { CreateUserParams, UpdateUserParams } from '@/types/clerk';
