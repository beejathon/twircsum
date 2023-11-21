import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const messageRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: { channelId: input.channelId },
      });
      const users = await ctx.db.user.findMany({
        where: { id: { in: messages.map((m) => m.authorId) } },
      });

      return messages.map((message) => ({
        message,
        author: users.find((u) => u.id === message.authorId),
      }));
    }),
});
