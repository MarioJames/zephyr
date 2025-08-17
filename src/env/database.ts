import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getServerDBConfig = () => {
  return createEnv({
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_DRIVER: process.env.DATABASE_DRIVER || 'neon',
      ADMIN_DATABASE_URL: process.env.ADMIN_DATABASE_URL,
      ADMIN_DATABASE_DRIVER: process.env.ADMIN_DATABASE_DRIVER || 'neon',
      ADMIN_KEY_VAULTS_SECRET: process.env.ADMIN_KEY_VAULTS_SECRET,
      CHAT_DATABASE_URL: process.env.CHAT_DATABASE_URL,
      CHAT_DATABASE_DRIVER: process.env.CHAT_DATABASE_DRIVER || 'neon',
    },
    server: {
      DATABASE_URL: z.string().optional(),
      DATABASE_DRIVER: z.enum(['neon', 'node']),
      ADMIN_DATABASE_URL: z.string().optional(),
      ADMIN_DATABASE_DRIVER: z.enum(['neon', 'node']),
      CHAT_DATABASE_URL: z.string().optional(),
      CHAT_DATABASE_DRIVER: z.enum(['neon', 'node']),
      ADMIN_KEY_VAULTS_SECRET: z.string().optional(),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
