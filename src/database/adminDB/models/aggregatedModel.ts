import { eq } from 'drizzle-orm';

import { AdminDatabase } from '../type';
import { AGGREGATED_MODEL } from '../schemas';

export type AggregatedModelSelect = typeof AGGREGATED_MODEL.$inferSelect;

export class AggregatedModelModel {
  private db: AdminDatabase;

  constructor(db: AdminDatabase) {
    this.db = db;
  }

  /**
   * 查询所有启用的聚合模型
   */
  findEnabled = async (): Promise<AggregatedModelSelect[]> => {
    return this.db.query.AGGREGATED_MODEL.findMany({
      where: eq(AGGREGATED_MODEL.enabled, true),
      orderBy: [AGGREGATED_MODEL.createdAt],
    });
  };

  /**
   * 根据ID查询聚合模型
   * @param id 模型ID
   */
  findById = async (id: string): Promise<AggregatedModelSelect | null> => {
    const result = await this.db.query.AGGREGATED_MODEL.findFirst({
      where: eq(AGGREGATED_MODEL.id, id),
    });
    return result || null;
  };
}
