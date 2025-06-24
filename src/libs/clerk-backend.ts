import { createClerkClient } from '@clerk/backend';
import type { ClerkClient } from '@clerk/backend';

/**
 * Clerk Backend Client 配置
 * 从环境变量中读取 Clerk 配置信息
 */
class ClerkBackend {
  private client: ClerkClient;

  constructor() {
    // 从环境变量中读取 Clerk 配置
    const secretKey = process.env.CLERK_SECRET_KEY;
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    
    if (!secretKey) {
      throw new Error('CLERK_SECRET_KEY environment variable is not set');
    }

    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is not set');
    }

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
export type { 
  User, 
  EmailAddress,
  Session,
  Organization
} from '@clerk/backend';