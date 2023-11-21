import { api } from "~/utils/api";

interface MessagesWindowProps {
  channelId: string;
}

export const MessageWindow = (props: MessagesWindowProps) => {
  const { data } = api.messages.getMessages.useQuery({
    channelId: props.channelId,
  });

  if (!data || !data.length) {
    return <div>Nothing here yet...</div>;
  }

  return (
    <>
      {data?.map(({ message, author }) => (
        <div key={message.id}>
          {author?.name}:{message.text}
        </div>
      ))}
    </>
  );
};
