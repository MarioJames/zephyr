import { and, eq } from 'drizzle-orm';

import { AdminDatabase } from '../type';
import { userVirtualKeys } from '../schemas';
import { KeyVaultsGateKeeper, KeyVaultItem } from '@/libs/keyVaultsEncrypt';

export type UserVirtualKeySelect = typeof userVirtualKeys.$inferSelect;

export interface VirtualKeyWithDecrypted
  extends Omit<UserVirtualKeySelect, 'keyVaults'> {
  keyVaults: Record<string, KeyVaultItem>;
}

export class VirtualKeyModel {
  private db: AdminDatabase;

  constructor(db: AdminDatabase) {
    this.db = db;
  }

  /**
   * 根据用户ID和角色ID查询虚拟KEY
   * @param userId 用户ID
   * @param roleId 角色ID
   * @returns 解密后的虚拟KEY信息
   */
  findByUserAndRole = async (
    userId: string,
    roleId: string
  ): Promise<VirtualKeyWithDecrypted | null> => {
    try {
      const result = await this.db.query.userVirtualKeys.findFirst({
        where: and(
          eq(userVirtualKeys.userId, userId),
          eq(userVirtualKeys.roleId, roleId)
        ),
      });

      if (!result) {
        return null;
      }

      // 解密 keyVaults 字段
      const decryptedKeyVaults = await KeyVaultsGateKeeper.getUserKeyVaults(
        '', // keyVaultsSecret 在方法内部从环境变量获取
        result.keyVaults,
        result.userId
      );

      return {
        ...result,
        keyVaults: decryptedKeyVaults,
      };
    } catch (error) {
      console.error('查询虚拟KEY失败:', error);
      throw new Error('查询虚拟KEY失败');
    }
  };
}
