import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

function getClerkEnv() {
  return createEnv({
    server: {
      CLERK_SECRET_KEY: z.string().optional(),
      CLERK_PUBLISHABLE_KEY: z.string().optional(),
    },
    runtimeEnv: {
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
      CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  });
}

export const clerkEnv = getClerkEnv();
