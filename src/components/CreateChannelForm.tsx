import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "~/utils/api";
import type { Channel } from "@prisma/client";

const CreateChannelForm = () => {
  const [channelName, setChannelName] = useState("");
  const { mutate: createChannel } = api.channels.create.useMutation();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createChannel(
      {
        name: channelName,
      },
      {
        onSuccess: (data) => {
          void router.push(`/channels/${data?.id}`);
        },
      },
    );

    setChannelName("");

    // router.push(`/channels/${channel.id}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default CreateChannelForm;
