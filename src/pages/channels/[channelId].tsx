import { useParams } from "next/navigation";
import { ChatInput } from "~/components/ChatInput";
import { MessageWindow } from "~/components/MessagesWindow";

const Channel = () => {
  const params = useParams<{ channelId: string }>();

  return (
    <>
      <MessageWindow channelId={params?.channelId} />
      <ChatInput channelId={params?.channelId} />
    </>
  );
};

export default Channel;
