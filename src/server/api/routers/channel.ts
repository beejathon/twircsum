import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const channelRouter = createTRPCRouter({
  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.channel.create({
  //       data: {
  //         name: input.name,
  //         ownerId: ctx.user!.id,

  //       },
  //     });
  //   }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.channel.findMany();
  }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.channel.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
