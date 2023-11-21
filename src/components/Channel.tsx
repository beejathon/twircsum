import { api } from "~/utils/api";

interface ChannelProps {
  channelId: string;
}

export const Channel = (props: ChannelProps) => {
  const { data } = api.messages.getMessages.useQuery({
    channelId: props.channelId,
  });

  if (!data) {
    return <div>Nothing here yet...</div>;
  }

  return (
    <>{data?.map((message) => <div key={message.id}>{message.text}</div>)}</>
  );
};
