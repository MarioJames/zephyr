import { Pool as NeonPool } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';

import { AdminDatabase } from './type';
import { serverDBEnv } from '@/config/db';
import * as schema from './schemas';

/**
 * 懒加载数据库实例
 * 避免每次模块导入时都初始化数据库
 */
let cachedDB: AdminDatabase | null = null;

export const getAdminDB = async (): Promise<AdminDatabase> => {
  // 如果已经有缓存的实例，直接返回
  if (cachedDB) return cachedDB;

  try {
    const client = new NeonPool({
      connectionString: serverDBEnv.ADMIN_DATABASE_URL,
    });
    cachedDB = neonDrizzle(client, { schema });
    return cachedDB;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

export const adminDB = getAdminDB();

export * from './type';
export * from './schemas';
export * from './models/aggregatedModel';
