import { api } from "~/utils/api";
import Link from "next/link";
import CreateChannelForm from "~/components/CreateChannelForm";
import { useState } from "react";

const ChannelsList = () => {
  const { data } = api.channels.getAll.useQuery();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
      <h1>Channels</h1>
      <button onClick={handleClick}>Create Channel</button>
      {open && <CreateChannelForm />}
      {data?.map((channel) => (
        <div key={channel.id}>
          <Link href={`/channels/${channel.id}`}>{channel.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default ChannelsList;
