import { type User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChatInput } from "~/components/ChatInput";
import { MessageWindow } from "~/components/MessagesWindow";
import { UserList } from "~/components/UserList";
import { pusherClient } from "~/server/pusher";

import { api } from "~/utils/api";
import { toPusherKey } from "~/utils/helpers";

const Channel = () => {
  const router = useRouter();
  const params = useParams<{ channelId: string }>();
  const { data } = api.channels.getUsers.useQuery({
    channelId: params?.channelId,
  });
  const { mutate: join } = api.channels.userJoin.useMutation();
  const { mutate: leave } = api.channels.userLeave.useMutation();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`channel-users:${params.channelId}`));

    const userJoinHandler = (user: User) => {
      if (!users.some((u) => u.id === user.id)) {
        setUsers((prev) => [...prev, user]);
      }
      console.log(`${Date.now()}: ${user.name} joined the channel`);
    };

    const userLeaveHandler = (user: User) => {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      console.log(`${Date.now()}: ${user.name} left the channel`);
    };

    pusherClient.bind("user-join", userJoinHandler);
    pusherClient.bind("user-leave", userLeaveHandler);

    if (router.isReady) {
      join({
        channelId: params?.channelId,
      });
    }

    return () => {
      leave({
        channelId: params?.channelId,
      });

      pusherClient.unsubscribe(
        toPusherKey(`channel-users:${params.channelId}`),
      );
      pusherClient.unbind("user-join", userJoinHandler);
      pusherClient.unbind("user-leave", userLeaveHandler);
      setUsers([]);
    };
  }, [join, leave, params?.channelId, router.isReady]);

  return (
    <>
      <MessageWindow channelId={params?.channelId} />
      <ChatInput channelId={params?.channelId} />
      <UserList users={users} />
    </>
  );
};

export default Channel;
