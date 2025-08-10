import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

function getCasdoorEnv() {
  return createEnv({
    server: {
      CASDOOR_ENDPOINT: z.string().url().optional(),
      CASDOOR_CLIENT_ID: z.string().optional(),
      CASDOOR_CLIENT_SECRET: z.string().optional(),
      CASDOOR_CERTIFICATE: z.string().optional(),
      CASDOOR_ORGANIZATION_NAME: z.string().optional(),
      CASDOOR_APPLICATION_NAME: z.string().optional(),
    },
    runtimeEnv: {
      CASDOOR_ENDPOINT: process.env.CASDOOR_ENDPOINT,
      CASDOOR_CLIENT_ID: process.env.CASDOOR_CLIENT_ID,
      CASDOOR_CLIENT_SECRET: process.env.CASDOOR_CLIENT_SECRET,
      CASDOOR_CERTIFICATE: process.env.CASDOOR_CERTIFICATE,
      CASDOOR_ORGANIZATION_NAME: process.env.CASDOOR_ORGANIZATION_NAME,
      CASDOOR_APPLICATION_NAME: process.env.CASDOOR_APPLICATION_NAME,
    },
  });
}

export const casdoorEnv = getCasdoorEnv();
