import { eq, desc } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';

import { ZephyrDatabase } from '../type';
import { structuredData } from '../schemas';

export interface StructuredDataItem {
  id: number;
  fileId: string;
  data: any; // JSONB 类型
}

export interface CreateStructuredDataParams {
  fileId: string;
  data: any;
}

export interface UpdateStructuredDataParams {
  data: any;
}

export class StructuredDataModel {
  private db: ZephyrDatabase;

  constructor(db: ZephyrDatabase) {
    this.db = db;
  }

  // 重置序列到当前最大ID + 1
  private resetSequence = async () => {
    await this.db.execute(
      sql`SELECT setval('structured_data_id_seq', (SELECT COALESCE(MAX(id) + 1, 1) FROM structured_data));`
    );
  };

  // ========== 基于 fileId 的单文件操作 ==========

  /**
   * 根据 fileId 获取结构化数据
   */
  findByFileId = async (fileId: string): Promise<StructuredDataItem | undefined> => {
    return this.db.query.structuredData.findFirst({
      where: eq(structuredData.fileId, fileId),
      orderBy: [desc(structuredData.id)],
    });
  };

  /**
   * 创建结构化数据记录
   */
  create = async (params: CreateStructuredDataParams): Promise<StructuredDataItem> => {
    // 重置序列
    await this.resetSequence();

    const data = await this.db
      .insert(structuredData)
      .values({
        fileId: params.fileId,
        data: params.data,
      })
      .returning();

    return data[0];
  };

  /**
   * 根据 fileId 更新结构化数据
   */
  updateByFileId = async (fileId: string, params: UpdateStructuredDataParams): Promise<StructuredDataItem | null> => {
    // 先检查是否存在记录
    const existing = await this.findByFileId(fileId);
    if (!existing) {
      return null;
    }

    await this.db
      .update(structuredData)
      .set(params)
      .where(eq(structuredData.fileId, fileId));

    // 返回更新后的记录
    return this.findByFileId(fileId);
  };

  /**
   * 根据 fileId 删除结构化数据
   */
  deleteByFileId = async (fileId: string): Promise<boolean> => {
    // 先检查是否存在记录
    const existing = await this.findByFileId(fileId);
    if (!existing) {
      return false;
    }

    await this.db
      .delete(structuredData)
      .where(eq(structuredData.fileId, fileId));

    return true;
  };

  /**
   * 创建或更新结构化数据（基于 fileId）
   */
  upsertByFileId = async (params: CreateStructuredDataParams): Promise<StructuredDataItem> => {
    // 先尝试查找现有记录
    const existing = await this.findByFileId(params.fileId);
    
    if (existing) {
      // 如果存在，更新数据
      const updated = await this.updateByFileId(params.fileId, { data: params.data });
      return updated!;
    } else {
      // 如果不存在，创建新记录
      return this.create(params);
    }
  };

  /**
   * 检查 fileId 是否存在结构化数据
   */
  existsByFileId = async (fileId: string): Promise<boolean> => {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(structuredData)
      .where(eq(structuredData.fileId, fileId));

    return Number(result[0]?.count || 0) > 0;
  };
}