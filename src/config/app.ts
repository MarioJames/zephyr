import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

import { isServerMode } from '@/const/version';

const APP_URL = process.env.APP_URL;

// only throw error in server mode and server side
if (typeof window === 'undefined' && isServerMode && !APP_URL) {
  throw new Error('`APP_URL` is required in server mode');
}

export const getAppConfig = () => {
  return createEnv({
    client: {
      NEXT_PUBLIC_BASE_PATH: z.string(),
    },
    server: {
      APP_URL: z.string().optional(),

      CUSTOM_FONT_FAMILY: z.string().optional(),
      CUSTOM_FONT_URL: z.string().optional(),
    },
    runtimeEnv: {
      APP_URL,
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
      CUSTOM_FONT_FAMILY: process.env.CUSTOM_FONT_FAMILY,
      CUSTOM_FONT_URL: process.env.CUSTOM_FONT_URL,
    },
  });
};

export const appEnv = getAppConfig();
