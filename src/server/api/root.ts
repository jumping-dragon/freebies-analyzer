import { awsRouter } from "~/server/api/routers/aws";
import { createTRPCRouter } from "~/server/api/trpc";
import { tseRouter } from "./routers/tse";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  aws: awsRouter,
  tse: tseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
