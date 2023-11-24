import { useEffect, useState } from "react";
import { pusherClient } from "~/server/pusher";
import { api } from "~/utils/api";
import { type RouterOutputs } from "~/utils/api";
import { toPusherKey } from "~/utils/helpers";
import { type Message } from "@prisma/client";
import { type User } from "@prisma/client";

interface NewMessage {
  message: Message;
  author: User;
}

type Messages = RouterOutputs["messages"]["getMessages"];

interface MessagesWindowProps {
  channelId: string;
}

export const MessageWindow = (props: MessagesWindowProps) => {
  const { data } = api.messages.getMessages.useQuery({
    channelId: props.channelId,
  });

  const [messages, setMessages] = useState<Messages | undefined>([]);

  useEffect(() => {
    if (data) {
      setMessages(data);
    }

    pusherClient.subscribe(toPusherKey(`channel:${props.channelId}`));

    const messageHandler = (newMessage: NewMessage) => {
      setMessages((prev) => [...(prev as Messages), newMessage]);
    };

    pusherClient.bind("new-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`channel:${props.channelId}`));
      pusherClient.unbind("new-message", messageHandler);
    };
  }, [props.channelId, data]);

  if (!data || !data.length) {
    return <div>Nothing here yet...</div>;
  }

  return (
    <>
      {messages?.map(({ message, author }) => (
        <div key={message.id}>
          {author?.name}:{message.text}
        </div>
      ))}
    </>
  );
};
