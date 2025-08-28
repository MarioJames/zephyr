import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

function getZephyrEnv() {
  return createEnv({
    client: {
      NEXT_PUBLIC_APP_URL: z.string(),
      NEXT_PUBLIC_APP_NAME: z.string(),
      NEXT_PUBLIC_OPENAPI_ENDPOINT: z.string().optional(),
      NEXT_PUBLIC_LITELLM_URL: z.string().optional(),
      NEXT_PUBLIC_TRANSLATION_PROMPT: z.string().optional(),
      NEXT_PUBLIC_NLP_ENDPOINT: z.string().optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME:
        process.env.NEXT_PUBLIC_APP_NAME || '保险客户管理系统',
      NEXT_PUBLIC_OPENAPI_ENDPOINT: process.env.NEXT_PUBLIC_OPENAPI_ENDPOINT,
      NEXT_PUBLIC_LITELLM_URL: process.env.NEXT_PUBLIC_LITELLM_URL,
      NEXT_PUBLIC_TRANSLATION_PROMPT:
        process.env.NEXT_PUBLIC_TRANSLATION_PROMPT,
      NEXT_PUBLIC_NLP_ENDPOINT: process.env.NEXT_PUBLIC_NLP_ENDPOINT,
    },
  });
}

export const zephyrEnv = getZephyrEnv();
