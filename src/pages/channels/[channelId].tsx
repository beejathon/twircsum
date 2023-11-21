import { useParams } from "next/navigation";
import { MessageWindow } from "~/components/MessagesWindow";

const Channel = () => {
  const params = useParams<{ channelId: string }>();

  return (
    <>
      <MessageWindow channelId={params?.channelId} />
    </>
  );
};

export default Channel;
