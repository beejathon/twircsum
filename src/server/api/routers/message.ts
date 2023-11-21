import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.db.message.findMany({ where: { channelId: input.channelId } });
    }),
});
