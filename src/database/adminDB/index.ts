import { Pool as NeonPool } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as nodeDrizzle } from 'drizzle-orm/node-postgres';
import { Pool as NodePool } from 'pg';

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

  let connectionString = serverDBEnv.ADMIN_DATABASE_URL;

  if (serverDBEnv.ADMIN_DATABASE_DRIVER === 'node') {
    const client = new NodePool({ connectionString });
    cachedDB = nodeDrizzle(client, { schema });
  } else {
    const client = new NeonPool({ connectionString });
    cachedDB = neonDrizzle(client, { schema });
  }

  return cachedDB;
};

export const adminDB = getAdminDB();

export * from './type';
export * from './schemas';
export * from './models/aggregatedModel';
