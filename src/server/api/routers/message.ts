import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusherServerClient } from "~/server/pusher";
import { toPusherKey } from "~/utils/helpers";

export const messageRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.message.findMany({
        where: { channelId: input.channelId },
        orderBy: { createdAt: "asc" },
      });
      const users = await ctx.db.user.findMany({
        where: { id: { in: messages.map((m) => m.authorId) } },
      });

      return messages.map((message) => ({
        message,
        author: users.find((u) => u.id === message.authorId),
      }));
    }),

  sendMessage: protectedProcedure
    .input(z.object({ channelId: z.string().min(1), text: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.db.message.create({
        data: {
          channelId: input.channelId,
          authorId: ctx.session.user.id,
          text: input.text,
        },
      });

      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      const newMessage = {
        message,
        author: user,
      };

      await pusherServerClient.trigger(
        toPusherKey(`channel:${input.channelId}`),
        "new-message",
        newMessage,
      );

      return newMessage;
    }),
});
