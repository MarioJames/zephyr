import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getLitellmConfig = () => {
  return createEnv({
    runtimeEnv: {
      LITELLM_BASE_URL: process.env.LITELLM_BASE_URL,
      LITELLM_MASTER_KEY: process.env.LITELLM_MASTER_KEY,
    },
    server: {
      LITELLM_BASE_URL: z.string().optional(),
      LITELLM_MASTER_KEY: z.string().optional(),
    },
  });
};

export const litellmEnv = getLitellmConfig();
