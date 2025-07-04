import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getServerDBConfig = () => {
  return createEnv({
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      KEY_VAULTS_SECRET: process.env.KEY_VAULTS_SECRET,
    },
    server: {
      DATABASE_URL: z.string().optional(),
      KEY_VAULTS_SECRET: z.string().optional(),
    },
  });
};

export const serverDBEnv = getServerDBConfig();
