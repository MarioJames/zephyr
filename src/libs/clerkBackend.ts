import { createClerkClient } from '@clerk/backend';
import type { ClerkClient } from '@clerk/backend';
import { clerkEnv } from '@/env/clerk';

/**
 * Clerk Backend Client 配置
 * 从环境变量中读取 Clerk 配置信息
 */
class ClerkBackend {
  private client: ClerkClient;

  constructor() {
    // 从统一的环境变量配置中读取 Clerk 配置
    const secretKey = clerkEnv.CLERK_SECRET_KEY;
    const publishableKey = clerkEnv.CLERK_PUBLISHABLE_KEY;

    // 由于 t3-env 已经进行了验证，这里不再需要手动检查
    // 如果环境变量不存在，t3-env 会在导入时抛出错误

    // 创建 Clerk 客户端
    this.client = createClerkClient({
      secretKey,
      publishableKey,
    });
  }

  /**
   * 获取 Clerk 客户端实例
   */
  getClient(): ClerkClient {
    return this.client;
  }

  /**
   * 获取用户管理接口
   */
  get users() {
    return this.client.users;
  }

  /**
   * 获取邮件管理接口
   */
  get emails() {
    return this.client.emailAddresses;
  }

  /**
   * 获取会话管理接口
   */
  get sessions() {
    return this.client.sessions;
  }

  /**
   * 获取组织管理接口
   */
  get organizations() {
    return this.client.organizations;
  }
}

// 导出单例实例
export const clerkBackend = new ClerkBackend();

// 导出类型
export type { ClerkClient } from '@clerk/backend';
export type { EmailAddress, Organization,Session, User } from '@clerk/backend';
