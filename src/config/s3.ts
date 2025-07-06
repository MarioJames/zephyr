import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getServerS3Config = () => {
  return createEnv({
    runtimeEnv: {
      NEXT_PUBLIC_S3_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_S3_PUBLIC_DOMAIN,
    },
    client: {
      NEXT_PUBLIC_S3_PUBLIC_DOMAIN: z.string().optional(),
    },
  });
};

export const serverS3Env = getServerS3Config();
