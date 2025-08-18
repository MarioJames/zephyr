import { eq } from 'drizzle-orm';

import { AdminDatabase } from '../type';
import { roleQuotas } from '../schemas';

export class QuotaModel {
  private db: AdminDatabase;

  constructor(db: AdminDatabase) {
    this.db = db;
  }

  /**
   * 根据角色ID获取限额信息
   */
  findByRoleId = async (roleId: string) => {
    const quota = await this.db.query.roleQuotas.findFirst({
      where: eq(roleQuotas.roleId, roleId),
    });

    return quota;
  };
}
