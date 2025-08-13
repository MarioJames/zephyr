import { Pool as NeonPool } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as nodeDrizzle } from 'drizzle-orm/node-postgres';
import { Pool as NodePool } from 'pg';

import { LobeChatDatabase } from './type';
import { serverDBEnv } from '@/env/database';
import * as schema from './schemas';

/**
 * 懒加载数据库实例
 * 避免每次模块导入时都初始化数据库
 */
let cachedDB: LobeChatDatabase | null = null;

export const getChatDB = async (): Promise<LobeChatDatabase> => {
  // 如果已经有缓存的实例，直接返回
  if (cachedDB) return cachedDB;

  const connectionString = serverDBEnv.CHAT_DATABASE_URL;

  if (serverDBEnv.CHAT_DATABASE_DRIVER === 'node') {
    const client = new NodePool({ connectionString });
    cachedDB = nodeDrizzle(client, { schema });
  } else {
    const client = new NeonPool({ connectionString });
    cachedDB = neonDrizzle(client, { schema });
  }

  return cachedDB;
};

export const chatDB = getChatDB();

export * from './schemas';
export * from './type';
