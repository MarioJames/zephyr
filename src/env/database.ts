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
      LOBE_DATABASE_URL: process.env.LOBE_DATABASE_URL,
      LOBE_DATABASE_DRIVER: process.env.LOBE_DATABASE_DRIVER || 'neon',
    },
    server: {
      DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
      DATABASE_DRIVER: z.enum(['neon', 'node']),
      ADMIN_DATABASE_URL: z.string().min(1, 'ADMIN_DATABASE_URL is required'),
      ADMIN_DATABASE_DRIVER: z.enum(['neon', 'node']),
      LOBE_DATABASE_URL: z.string().min(1, 'LOBE_DATABASE_URL is required'),
      LOBE_DATABASE_DRIVER: z.enum(['neon', 'node']),
      ADMIN_KEY_VAULTS_SECRET: z
        .string()
        .min(1, 'ADMIN_KEY_VAULTS_SECRET is required'),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
