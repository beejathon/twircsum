import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pusherServerClient } from "~/server/pusher";
import { toPusherKey } from "~/utils/helpers";

export const channelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.db.channel.create({
        data: {
          name: input.name,
          ownerId: ctx.session.user.id,
        },
      });

      return channel;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.channel.findMany();
  }),

  getUsers: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.channel
        .findFirst({
          where: { id: input.channelId },
        })
        .users();

      return users;
    }),

  userJoin: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      await ctx.db.channel.update({
        where: { id: input.channelId },
        data: {
          users: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      await pusherServerClient.trigger(
        toPusherKey(`channel-users:${input.channelId}`),
        "user-join",
        user,
      );

      console.log(`user ${user?.name} joined channel ${input.channelId}`);

      return user;
    }),

  userLeave: protectedProcedure
    .input(z.object({ channelId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      await ctx.db.channel.update({
        where: { id: input.channelId },
        data: {
          users: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      await pusherServerClient.trigger(
        toPusherKey(`channel-users:${input.channelId}`),
        "user-leave",
        user,
      );

      console.log(`user ${user?.name} left channel ${input.channelId}`);

      return user;
    }),
});
