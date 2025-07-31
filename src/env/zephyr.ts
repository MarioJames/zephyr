import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

function getZephyrEnv() {
  return createEnv({
    client: {
      NEXT_PUBLIC_APP_NAME: z.string(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_APP_NAME:
        process.env.NEXT_PUBLIC_APP_NAME || '保险客户管理系统',
    },
  });
}

export const zephyrEnv = getZephyrEnv();
