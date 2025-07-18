import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getServerDBConfig = () => {
  return createEnv({
    runtimeEnv: {
      ZEPHYR_DATABASE_URL: process.env.ZEPHYR_DATABASE_URL,
      ADMIN_DATABASE_URL: process.env.ADMIN_DATABASE_URL,
      KEY_VAULTS_SECRET: process.env.KEY_VAULTS_SECRET,
    },
    server: {
      ZEPHYR_DATABASE_URL: z.string().min(1, 'ZEPHYR_DATABASE_URL is required'),
      ADMIN_DATABASE_URL: z.string().min(1, 'ADMIN_DATABASE_URL is required'),
      KEY_VAULTS_SECRET: z.string().min(1, 'KEY_VAULTS_SECRET is required'),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
