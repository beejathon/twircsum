import { useState } from "react";
import { api } from "~/utils/api";

type ChatInputProps = {
  channelId: string;
};

export const ChatInput = (props: ChatInputProps) => {
  const [text, setText] = useState("");

  const { mutate } = api.messages.sendMessage.useMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate({
      channelId: props.channelId,
      text,
    });

    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </form>
  );
};
