import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getServerDBConfig = () => {
  return createEnv({
    runtimeEnv: {
      ZEPHYR_DATABASE_URL: process.env.ZEPHYR_DATABASE_URL,
      ZEPHYR_DATABASE_DRIVER: process.env.ZEPHYR_DATABASE_DRIVER || 'neon',
      ADMIN_DATABASE_URL: process.env.ADMIN_DATABASE_URL,
      ADMIN_DATABASE_DRIVER: process.env.ADMIN_DATABASE_DRIVER || 'neon',
      LOBE_DATABASE_URL: process.env.LOBE_DATABASE_URL,
      LOBE_DATABASE_DRIVER: process.env.LOBE_DATABASE_DRIVER || 'neon',
      KEY_VAULTS_SECRET: process.env.KEY_VAULTS_SECRET,
    },
    server: {
      ZEPHYR_DATABASE_URL: z.string().min(1, 'ZEPHYR_DATABASE_URL is required'),
      ZEPHYR_DATABASE_DRIVER: z.enum(['neon', 'node']),
      ADMIN_DATABASE_URL: z.string().min(1, 'ADMIN_DATABASE_URL is required'),
      ADMIN_DATABASE_DRIVER: z.enum(['neon', 'node']),
      LOBE_DATABASE_URL: z.string().min(1, 'LOBE_DATABASE_URL is required'),
      LOBE_DATABASE_DRIVER: z.enum(['neon', 'node']),
      KEY_VAULTS_SECRET: z.string().min(1, 'KEY_VAULTS_SECRET is required'),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
