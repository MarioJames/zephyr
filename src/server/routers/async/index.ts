import { publicProcedure, asyncRouter as router } from '@/libs/trpc/async';

export const asyncRouter = router({
  healthcheck: publicProcedure.query(() => "i'm live!"),
});

export type AsyncRouter = typeof asyncRouter;

export * from './caller';
