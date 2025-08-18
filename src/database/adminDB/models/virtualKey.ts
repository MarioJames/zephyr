import { and, eq } from 'drizzle-orm';

import { AdminDatabase } from '../type';
import { userVirtualKeys } from '../schemas';
import { KeyVaultsGateKeeper, KeyVaultItem } from '@/libs/keyVaultsEncrypt';
import { serverDBEnv } from '@/env/database';

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

      const { decrypt } = await KeyVaultsGateKeeper.initWithEnvKey(
        serverDBEnv.ADMIN_KEY_VAULTS_SECRET
      );

      const { wasAuthentic, plaintext } = await decrypt(result.keyVaults);

      return {
        ...result,
        keyVaults: wasAuthentic ? JSON.parse(plaintext) : {},
      };
    } catch (error) {
      console.error('查询虚拟KEY失败:', error);
      throw new Error('查询虚拟KEY失败');
    }
  };

  /**
   * 向表中添加虚拟KEY数据
   * @param data 要插入的数据
   * @returns 插入操作是否成功
   */
  create = async (
    userId: string,
    roleId: string,
    virtualKeyInfo: Record<string, string>
  ): Promise<boolean> => {
    try {
      const { encrypt } = await KeyVaultsGateKeeper.initWithEnvKey(
        serverDBEnv.ADMIN_KEY_VAULTS_SECRET
      );

      const encryptedKeyVaults = await encrypt(virtualKeyInfo);

      await this.db.insert(userVirtualKeys).values({
        userId,
        roleId,
        keyVaults: encryptedKeyVaults,
      });

      return true;
    } catch (error) {
      console.error('创建虚拟KEY失败:', error);
      throw new Error('创建虚拟KEY失败');
    }
  };

  /**
   * 根据用户ID和角色ID删除虚拟KEY
   * @param userId 用户ID
   * @param roleId 角色ID
   * @returns 删除操作是否成功
   */
  deleteByUserAndRole = async (
    userId: string,
    roleId: string
  ): Promise<boolean> => {
    try {
      await this.db
        .delete(userVirtualKeys)
        .where(
          and(
            eq(userVirtualKeys.userId, userId),
            eq(userVirtualKeys.roleId, roleId)
          )
        );

      return true;
    } catch (error) {
      console.error('删除虚拟KEY失败:', error);
      throw new Error('删除虚拟KEY失败');
    }
  };
}
